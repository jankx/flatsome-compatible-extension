<?php
namespace Jankx\Extensions\FlatsomeCompatible\Services;

use Jankx\Extensions\FlatsomeCompatible\Contracts\UxBuilderServiceInterface;
use Jankx\Extensions\FlatsomeCompatible\Registry\ElementTypeRegistry;

class UxBuilderService implements UxBuilderServiceInterface
{
    protected static $instance;
    protected $extensionPath;
    protected $extensionUrl;

    protected function __construct($extensionPath, $extensionUrl)
    {
        $this->extensionPath = $extensionPath;
        $this->extensionUrl = $extensionUrl;
        $this->bootstrap();
    }

    public static function getInstance($extensionPath = '', $extensionUrl = ''): self
    {
        if (self::$instance === null) {
            self::$instance = new self($extensionPath, $extensionUrl);
        }
        return self::$instance;
    }

    protected function bootstrap(): void
    {
        $this->registerDefaultStrategies();

        do_action('jankx/ux-builder/init', $this);
    }

    protected function registerDefaultStrategies(): void
    {
        $strategies = [
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\SectionStrategy(),
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\RowStrategy(),
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\ColumnStrategy(),
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\TextStrategy(),
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\ImageStrategy(),
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\ButtonStrategy(),
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\SliderStrategy(),
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\GalleryStrategy(),
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\VideoStrategy(),
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\MapStrategy(),
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\GapStrategy(),
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\DividerStrategy(),
            new \Jankx\Extensions\FlatsomeCompatible\Strategies\IconStrategy(),
        ];

        $strategies = apply_filters('jankx/ux-builder/default-strategies', $strategies);
        ElementTypeRegistry::registerMultiple($strategies);
    }

    public function getElementTypes(): array
    {
        return apply_filters('jankx/ux-builder/element-types', array_keys(ElementTypeRegistry::all()));
    }

    public function getDefaultLayout(): array
    {
        $default = [
            [
                'type' => 'section',
                'label' => 'Hero Section',
                'props' => [
                    'bg_color' => '#0f172a',
                    'padding_top' => '120px',
                    'padding_bottom' => '120px',
                    'overlay' => 'rgba(15, 23, 42, 0.85)',
                ],
                'children' => [
                    [
                        'type' => 'row',
                        'label' => 'Brand row',
                        'props' => ['gutter' => 'large', 'width' => 'container'],
                        'children' => [
                            [
                                'type' => 'column',
                                'label' => 'Hero Content',
                                'props' => ['span' => 7, 'padding' => '0px', 'text_align' => 'left'],
                                'children' => [
                                    ['type' => 'text', 'label' => 'Heading', 'props' => ['text' => '<h1 style="color:#ffffff;">Welcome to Jankx UX</h1>'], 'children' => []],
                                    ['type' => 'button', 'label' => 'Button', 'props' => ['text' => 'Get Started', 'color' => 'success', 'size' => 'large'], 'children' => []],
                                ],
                            ],
                            [
                                'type' => 'column',
                                'label' => 'Visual',
                                'props' => ['span' => 5, 'text_align' => 'center'],
                                'children' => [
                                    ['type' => 'image', 'label' => 'Hero Image', 'props' => ['url' => '', 'radius' => '12px'], 'children' => []],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        return apply_filters('jankx/ux-builder/default-layout', $default);
    }

    public function renderShortcodes(array $elements): string
    {
        $output = '';
        foreach ($elements as $el) {
            $strategy = ElementTypeRegistry::get($el['type']);
            if ($strategy) {
                $output .= $strategy->getShortcode($el['props'] ?? []);
                if (!empty($el['children'])) {
                    $output .= "\n" . $this->renderShortcodes($el['children']);
                    $output .= sprintf('[/%s]', $el['type']);
                }
                $output .= "\n";
            }
        }
        return $output;
    }

    public function parseShortcodes(string $text): array
    {
        return apply_filters('jankx/ux-builder/parsed-shortcodes', []);
    }

    public function getAssetUrl(string $path = ''): string
    {
        $url = trailingslashit($this->extensionUrl) . 'assets';
        if ($path) {
            $url .= '/' . ltrim($path, '/');
        }
        return $url;
    }

    public function getAssetPath(string $path = ''): string
    {
        $dir = trailingslashit($this->extensionPath) . 'assets';
        if ($path) {
            $dir .= '/' . ltrim($path, '/');
        }
        return $dir;
    }
}
