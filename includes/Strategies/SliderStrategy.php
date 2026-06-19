<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class SliderStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'slider'; }
    public function getCategory(): string { return 'Content'; }
    public function getIcon(): string { return 'dashicons-images-alt2'; }

    public function getDefaultProps(): array
    {
        return [
            'height' => '400px',
            'autoplay' => false,
            'class' => '',
        ];
    }
}
