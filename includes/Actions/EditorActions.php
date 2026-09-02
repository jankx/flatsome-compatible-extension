<?php
namespace Jankx\Extensions\FlatsomeCompatible\Actions;

use Jankx\Extensions\FlatsomeCompatible\Helpers\States;
use Jankx\Extensions\FlatsomeCompatible\Helpers\Urls;
use Jankx\Extensions\FlatsomeCompatible\Services\UxBuilderService;

class EditorActions
{
    protected $service;

    public function __construct(UxBuilderService $service)
    {
        $this->service = $service;
    }

    public function register(): void
    {
        add_action('current_screen', [$this, 'interceptEditor'], 1);

        add_filter('page_row_actions', [$this, 'rowActions'], 10, 2);
        add_filter('post_row_actions', [$this, 'rowActions'], 10, 2);

        add_action('add_meta_boxes', [$this, 'registerEditorTabs']);

        add_filter('removable_query_args', [$this, 'keepRemovableArgs']);
    }

    public function keepRemovableArgs(array $args): array
    {
        $args[] = 'app';
        $args[] = 'type';
        $args[] = 'edit_post_id';
        return $args;
    }

    public function rowActions(array $actions, \WP_Post $post): array
    {
        $postTypes = $this->getSupportedPostTypes();

        if (!array_key_exists($post->post_type, $postTypes)) {
            return $actions;
        }

        if (!current_user_can('edit_post', $post->ID)) {
            return $actions;
        }

        $editUrl = Urls::editUrl($post->ID);
        array_splice($actions, 1, 0, [
            sprintf(
                '<a href="%s" style="color:#8b5cf6;font-weight:600;">%s</a>',
                esc_url($editUrl),
                __('Edit with UX Builder', 'jankx')
            ),
        ]);

        return $actions;
    }

    public function registerEditorTabs(): void
    {
        global $post;

        if (!$post || !current_user_can('edit_post', $post->ID)) {
            return;
        }

        $postTypes = $this->getSupportedPostTypes();

        $screen = get_current_screen();
        if (!$screen || !array_key_exists($screen->id, $postTypes)) {
            return;
        }

        if (States::isEditor()) {
            return;
        }

        add_action('edit_form_top', [$this, 'renderEditorTabs']);
    }

    public function renderEditorTabs(): void
    {
        global $post;

        $currentUrl = admin_url('post.php?post=' . $post->ID . '&action=edit');
        $uxBuilderUrl = Urls::editUrl($post->ID);
        ?>
        <h2 id="jankx-uxbuilder-tabs" class="nav-tab-wrapper woo-nav-tab-wrapper">
            <a href="<?php echo esc_url($currentUrl); ?>" class="nav-tab nav-tab-active">
                <?php echo esc_html__('Editor', 'jankx'); ?>
            </a>
            <a href="<?php echo esc_url($uxBuilderUrl); ?>" class="nav-tab">
                <strong style="color:#8b5cf6; padding: 0px 5px; margin-right:5px; border: 2px solid #8b5cf6;">UX</strong>
                <?php echo esc_html__('Builder', 'jankx'); ?>
            </a>
        </h2>
        <?php
    }

    public function interceptEditor(\WP_Screen $screen): void
    {
        if (!States::isEditor()) {
            return;
        }

        if (wp_doing_ajax()) {
            return;
        }

        if ($screen->base !== 'post') {
            return;
        }

        $postTypes = $this->getSupportedPostTypes();
        $postId = intval($_GET['post'] ?? 0);
        $post = get_post($postId);

        if (!$post || !array_key_exists($post->post_type, $postTypes)) {
            return;
        }

        if (!current_user_can('edit_post', $post->ID)) {
            return;
        }

        $type = sanitize_text_field(wp_unslash($_GET['type'] ?? 'editor'));

        if ($type === 'editor') {
            $this->enqueueEditorAssets($post);
        }

        $this->renderTemplate($type, $post);
        die;
    }

    protected function enqueueEditorAssets(\WP_Post $post): void
    {
        $manifestPath = $this->service->getAssetPath('dist/.vite/manifest.json');

        if (!file_exists($manifestPath)) {
            return;
        }

        $manifest = json_decode(file_get_contents($manifestPath), true);
        $entry = $manifest['src/main.tsx'] ?? null;

        if (!$entry) {
            return;
        }

        $assetUrl = $this->service->getAssetUrl('dist');

        if (!empty($entry['css'])) {
            foreach ($entry['css'] as $cssFile) {
                wp_enqueue_style(
                    'jankx-ux-builder',
                    $assetUrl . '/' . $cssFile,
                    [],
                    '1.0.0'
                );
            }
        }

        if (!empty($entry['file'])) {
            wp_enqueue_script(
                'jankx-ux-builder',
                $assetUrl . '/' . $entry['file'],
                [],
                '1.0.0',
                true
            );

            $backUrl = isset($_SERVER['HTTP_REFERER'])
                ? esc_url_raw($_SERVER['HTTP_REFERER'])
                : admin_url('post.php?post=' . $post->ID . '&action=edit');

            if ($post->post_status !== 'publish' && strpos($backUrl, 'preview=true') === false) {
                $backUrl = admin_url('post.php?post=' . $post->ID . '&action=edit');
            }

            wp_localize_script('jankx-ux-builder', 'jankxUxBuilder', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'restUrl' => rest_url('jankx/ux-builder/v1'),
                'nonce' => wp_create_nonce('wp_rest'),
                'elementTypes' => $this->getElementTypesForJs(),
                'defaultLayout' => $this->service->getDefaultLayout(),
                'editingPost' => [
                    'id' => $post->ID,
                    'title' => $post->post_title,
                    'status' => $post->post_status,
                    'permalink' => get_permalink($post->ID),
                ],
                'iframeUrl' => Urls::iframeUrl($post->ID),
                'backUrl' => $backUrl,
                'editUrl' => admin_url('post.php?post=' . $post->ID . '&action=edit'),
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
    }

    protected function renderTemplate(string $type, \WP_Post $post): void
    {
        // Set global post so admin-bar functions don't crash on null post_type.
        $GLOBALS['post'] = $post;
        setup_postdata($post);

        // Suppress deprecated wp_admin_bar_header (removed in WP 6.4).
        remove_action('wp_head', 'wp_admin_bar_header');

        // The UX Builder editor doesn't need the WP admin bar inside the iframe.
        add_filter('show_admin_bar', '__return_false');

        $title = __('UX Builder', 'jankx');
        if ($post) {
            $title .= ' &raquo; ' . $post->post_title;
        }
        ?>
        <!DOCTYPE html>
        <html lang="<?php echo esc_attr(get_bloginfo('language')); ?>">

        <head>
            <meta charset="<?php bloginfo('charset'); ?>">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <title><?php echo esc_html($title); ?></title>
            <?php wp_head(); ?>
        </head>

        <body class="jankx-ux-builder-body">
            <div id="jankx-ux-builder-app" class="jankx-ux-builder-wrap">
                <div id="root"></div>
            </div>
            <?php wp_footer(); ?>
        </body>

        </html>
        <?php
    }

    public function getSupportedPostTypes(): array
    {
        return apply_filters('jankx/ux-builder/supported-post-types', [
            'page' => 'page',
            'post' => 'post',
            'blocks' => 'blocks',
            'ux_block' => 'ux_block',
        ]);
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
