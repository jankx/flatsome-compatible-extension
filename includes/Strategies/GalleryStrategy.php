<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class GalleryStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'gallery'; }
    public function getCategory(): string { return 'Content'; }
    public function getIcon(): string { return 'dashicons-format-gallery'; }

    public function getDefaultProps(): array
    {
        return [
            'columns' => 3,
            'class' => '',
            'images' => [],
        ];
    }
}
