<?php
namespace Jankx\Extensions\FlatsomeCompatible\Admin;

use Jankx\Extensions\FlatsomeCompatible\Services\UxBuilderService;

class UxBuilderPage
{
    protected $service;
    protected $hookSuffix;
    protected $pageSlug = 'jankx-ux-builder';

    public function __construct(UxBuilderService $service)
    {
        $this->service = $service;
    }

    public function register()
    {
        $this->hookSuffix = add_menu_page(
            __('UX Builder', 'jankx'),
            __('UX Builder', 'jankx'),
            'edit_theme_options',
            $this->pageSlug,
            [$this, 'render'],
            'dashicons-layout',
            30
        );

        add_action("admin_enqueue_scripts", [$this, 'enqueueAssets']);

        do_action('jankx/ux-builder/admin-page-registered', $this->hookSuffix, $this);
    }

    public function enqueueAssets($hook)
    {
        if ($hook !== $this->hookSuffix) {
            return;
        }

        $assetUrl = $this->service->getAssetUrl();

        do_action('jankx/ux-builder/before-enqueue-assets', $hook);

        $styleFile = $assetUrl . '/dist/index.css';
        $scriptFile = $assetUrl . '/dist/index.js';

        if (file_exists($this->service->getAssetPath('dist/index.css'))) {
            wp_enqueue_style(
                'jankx-ux-builder',
                $styleFile,
                [],
                '1.0.0'
            );
        }

        if (file_exists($this->service->getAssetPath('dist/index.js'))) {
            wp_enqueue_script(
                'jankx-ux-builder',
                $scriptFile,
                ['wp-element'],
                '1.0.0',
                true
            );

            wp_localize_script('jankx-ux-builder', 'jankxUxBuilder', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'restUrl' => rest_url('jankx/ux-builder/v1'),
                'nonce' => wp_create_nonce('wp_rest'),
                'elementTypes' => $this->getElementTypesForJs(),
                'defaultLayout' => $this->service->getDefaultLayout(),
                'strings' => apply_filters('jankx/ux-builder/js-strings', [
                    'save' => __('Save', 'jankx'),
                    'cancel' => __('Cancel', 'jankx'),
                    'delete' => __('Delete', 'jankx'),
                    'duplicate' => __('Duplicate', 'jankx'),
                    'preview' => __('Preview', 'jankx'),
                    'export' => __('Export', 'jankx'),
                    'import' => __('Import', 'jankx'),
                ]),
            ]);
        }

        do_action('jankx/ux-builder/after-enqueue-assets', $hook);
    }

    public function render()
    {
        do_action('jankx/ux-builder/before-render');
        ?>
        <div id="jankx-ux-builder-app" class="jankx-ux-builder-wrap">
            <div id="root"></div>
        </div>
        <?php
        do_action('jankx/ux-builder/after-render');
    }

    protected function getElementTypesForJs(): array
    {
        $types = [];
        $registry = \Jankx\Extensions\FlatsomeCompatible\Registry\ElementTypeRegistry::class;

        foreach ($registry::all() as $type => $strategy) {
            $types[] = [
                'type' => $strategy->getType(),
                'label' => $strategy->getLabel(),
                'category' => $strategy->getCategory(),
                'icon' => $strategy->getIcon(),
                'defaultProps' => $strategy->getDefaultProps(),
            ];
        }

        return apply_filters('jankx/ux-builder/admin-element-types', $types);
    }
}
