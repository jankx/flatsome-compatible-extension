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
        $this->uxBuilderService = UxBuilderService::getInstance(
            $this->get_extension_path(),
            $this->get_extension_url()
        );

        add_action('admin_init', [$this, 'maybeRedirectToUxBuilder']);

        add_action('admin_menu', function () {
            $page = new UxBuilderPage($this->uxBuilderService);
            $page->register();
            $this->addUxBlocksSubmenu();
        });

        add_action('rest_api_init', function () {
            $this->registerRestRoutes();
        });

        add_filter('page_row_actions', [$this, 'addEditWithUxBuilderLink'], 10, 2);
        add_filter('post_row_actions', [$this, 'addEditWithUxBuilderLink'], 10, 2);

        add_action('admin_footer-edit.php', [$this, 'addUxBuilderNewPageButton']);

        add_action('init', [$this, 'registerUxBlockPostType']);

        add_filter('jankx/ux-builder/element-types', function ($types) {
            return apply_filters('jankx/ux-builder/registered-element-types', $types);
        });

        do_action('jankx/ux-builder/hooks-registered', $this);
    }

    public function addEditWithUxBuilderLink(array $actions, \WP_Post $post): array
    {
        $supported = apply_filters('jankx/ux-builder/supported-post-types', ['page', 'post', 'blocks']);

        if (!in_array($post->post_type, $supported, true)) {
            return $actions;
        }

        if (!current_user_can('edit_theme_options')) {
            return $actions;
        }

        $editUrl = admin_url('post.php?post=' . $post->ID . '&action=edit&jankx-ux-builder=true');
        $actions['edit_with_ux_builder'] = sprintf(
            '<a href="%s" style="color:#8b5cf6;font-weight:600;">%s</a>',
            esc_url($editUrl),
            __('Edit with UX Builder', 'jankx')
        );

        return $actions;
    }

    public function addUxBuilderNewPageButton(): void
    {
        $screen = get_current_screen();
        if (!$screen || $screen->id !== 'edit-page') {
            return;
        }

        if (!current_user_can('edit_theme_options')) {
            return;
        }

        $uxBuilderUrl = add_query_arg('jankx-ux-builder', '1', admin_url('post-new.php?post_type=page'));
        ?>
        <script type="text/javascript">
        (function($) {
            var $button = $('<a href="<?php echo esc_url($uxBuilderUrl); ?>" class="page-title-action" style="color:#8b5cf6;font-weight:600;"><?php echo esc_html__('Add New with UX Builder', 'jankx'); ?></a>');
            $('.page-title-action').last().after($button);
        })(jQuery);
        </script>
        <?php
    }

    public function maybeRedirectToUxBuilder(): void
    {
        if (!isset($_GET['jankx-ux-builder']) || !is_admin()) {
            return;
        }

        if (!current_user_can('edit_theme_options')) {
            return;
        }

        $params = ['page' => 'jankx-ux-builder'];

        if (isset($_GET['post_id'])) {
            $params['post_id'] = intval($_GET['post_id']);
        } elseif (isset($_GET['post']) && isset($_GET['action']) && $_GET['action'] === 'edit') {
            $params['post_id'] = intval($_GET['post']);
        }

        wp_safe_redirect(admin_url('admin.php?' . http_build_query($params)));
        exit;
    }

    public function registerUxBlockPostType(): void
    {
        $labels = [
            'name'                  => __('UX Blocks', 'jankx'),
            'singular_name'         => __('UX Block', 'jankx'),
            'add_new'               => __('Add New Block', 'jankx'),
            'add_new_item'          => __('Add New UX Block', 'jankx'),
            'edit_item'             => __('Edit UX Block', 'jankx'),
            'new_item'              => __('New UX Block', 'jankx'),
            'view_item'             => __('View UX Block', 'jankx'),
            'search_items'          => __('Search UX Blocks', 'jankx'),
            'not_found'             => __('No UX Blocks found', 'jankx'),
            'not_found_in_trash'    => __('No UX Blocks found in Trash', 'jankx'),
            'all_items'             => __('All UX Blocks', 'jankx'),
            'menu_name'             => __('UX Blocks', 'jankx'),
        ];

        $args = [
            'labels'              => $labels,
            'public'              => false,
            'show_ui'             => true,
            'show_in_menu'        => false,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => false,
            'rewrite'             => false,
            'query_var'           => false,
            'capability_type'     => ['ux_block', 'ux_blocks'],
            'capabilities'        => [
                'edit_post'          => 'edit_theme_options',
                'read_post'          => 'edit_theme_options',
                'delete_post'        => 'edit_theme_options',
                'edit_posts'         => 'edit_theme_options',
                'edit_others_posts'  => 'edit_theme_options',
                'publish_posts'      => 'edit_theme_options',
                'read_private_posts' => 'edit_theme_options',
                'delete_posts'       => 'edit_theme_options',
                'delete_private_posts' => 'edit_theme_options',
                'delete_published_posts' => 'edit_theme_options',
                'delete_others_posts' => 'edit_theme_options',
                'edit_private_posts' => 'edit_theme_options',
                'edit_published_posts' => 'edit_theme_options',
                'create_posts'      => 'edit_theme_options',
            ],
            'menu_icon'           => 'dashicons-layout',
            'supports'            => ['title', 'editor', 'revisions'],
            'show_in_rest'        => true,
            'rest_base'           => 'ux-blocks',
        ];

        register_post_type('ux_block', $args);
    }

    protected function addUxBlocksSubmenu(): void
    {
        add_submenu_page(
            'jankx-ux-builder',
            __('All UX Blocks', 'jankx'),
            __('All UX Blocks', 'jankx'),
            'edit_theme_options',
            'edit.php?post_type=ux_block'
        );
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
        $postId = $request->get_param('post_id');
        $layout = null;

        if ($postId) {
            $layout = get_post_meta($postId, '_jankx_ux_builder_layout', true);
        }

        if (!$layout) {
            $layout = get_option('jankx_ux_builder_layout', $this->uxBuilderService->getDefaultLayout());
        }

        return rest_ensure_response([
            'success' => true,
            'data' => $layout,
        ]);
    }

    public function saveLayout(\WP_REST_Request $request)
    {
        $layout = $request->get_param('layout');
        $postId = $request->get_param('post_id');

        if (!is_array($layout)) {
            return rest_ensure_response([
                'success' => false,
                'message' => __('Invalid layout data.', 'jankx'),
            ]);
        }

        $layout = apply_filters('jankx/ux-builder/before-save-layout', $layout);

        if ($postId) {
            update_post_meta($postId, '_jankx_ux_builder_layout', $layout);
        } else {
            update_option('jankx_ux_builder_layout', $layout);
        }

        do_action('jankx/ux-builder/layout-saved', $layout, $postId);

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
