<?php
namespace Jankx\Extensions\FlatsomeCompatible;

use Jankx\Extensions\AbstractExtension;
use Jankx\Extensions\FlatsomeCompatible\Admin\UxBuilderPage;
use Jankx\Extensions\FlatsomeCompatible\Services\UxBuilderService;
use Jankx\Extensions\FlatsomeCompatible\Registry\ElementTypeRegistry;

class FlatsomeCompatibleExtension extends AbstractExtension
{
    protected static $instance;

    protected $uxBuilderService;

    public function __construct()
    {
        $this->register_autoloader();
        parent::__construct();
    }

    protected function register_autoloader()
    {
        spl_autoload_register(function ($class) {
            $prefix  = 'Jankx\\Extensions\\FlatsomeCompatible\\';
            $base_dir = __DIR__ . '/includes/';

            $len = strlen($prefix);
            if (strncmp($prefix, $class, $len) !== 0) {
                return;
            }

            $relative_class = substr($class, $len);
            $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

            if (file_exists($file)) {
                require $file;
            }
        });
    }

    public function init(): void
    {
        self::$instance = $this;

        $this->uxBuilderService = UxBuilderService::getInstance(
            $this->get_extension_path(),
            $this->get_extension_url()
        );

        do_action('jankx/ux-builder/loaded', $this);
    }

    public static function get_instance(): ?self
    {
        return self::$instance;
    }

    public function getService(): UxBuilderService
    {
        return $this->uxBuilderService;
    }

    public function getElementRegistry(): ElementTypeRegistry
    {
        return ElementTypeRegistry::class;
    }

    public function register_hooks(): void
    {
        add_action('admin_menu', function () {
            $page = new UxBuilderPage($this->uxBuilderService);
            $page->register();
        });

        add_action('rest_api_init', function () {
            $this->registerRestRoutes();
        });

        add_filter('jankx/ux-builder/element-types', function ($types) {
            return apply_filters('jankx/ux-builder/registered-element-types', $types);
        });

        do_action('jankx/ux-builder/hooks-registered', $this);
    }

    protected function registerRestRoutes(): void
    {
        register_rest_route('jankx/ux-builder/v1', '/layout', [
            'methods' => 'GET',
            'callback' => [$this, 'getLayout'],
            'permission_callback' => function () {
                return current_user_can('edit_theme_options');
            },
        ]);

        register_rest_route('jankx/ux-builder/v1', '/layout', [
            'methods' => 'POST',
            'callback' => [$this, 'saveLayout'],
            'permission_callback' => function () {
                return current_user_can('edit_theme_options');
            },
        ]);

        register_rest_route('jankx/ux-builder/v1', '/element-types', [
            'methods' => 'GET',
            'callback' => [$this, 'getElementTypes'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function getLayout(\WP_REST_Request $request)
    {
        $layout = get_option('jankx_ux_builder_layout', $this->uxBuilderService->getDefaultLayout());
        return rest_ensure_response([
            'success' => true,
            'data' => $layout,
        ]);
    }

    public function saveLayout(\WP_REST_Request $request)
    {
        $layout = $request->get_param('layout');
        if (!is_array($layout)) {
            return rest_ensure_response([
                'success' => false,
                'message' => __('Invalid layout data.', 'jankx'),
            ]);
        }

        $layout = apply_filters('jankx/ux-builder/before-save-layout', $layout);
        update_option('jankx_ux_builder_layout', $layout);
        do_action('jankx/ux-builder/layout-saved', $layout);

        return rest_ensure_response([
            'success' => true,
            'message' => __('Layout saved successfully.', 'jankx'),
        ]);
    }

    public function getElementTypes(\WP_REST_Request $request)
    {
        $types = [];
        foreach (ElementTypeRegistry::all() as $type => $strategy) {
            $types[] = [
                'type' => $strategy->getType(),
                'label' => $strategy->getLabel(),
                'category' => $strategy->getCategory(),
                'icon' => $strategy->getIcon(),
                'defaultProps' => $strategy->getDefaultProps(),
            ];
        }
        return rest_ensure_response([
            'success' => true,
            'data' => apply_filters('jankx/ux-builder/rest-element-types', $types),
        ]);
    }
}
