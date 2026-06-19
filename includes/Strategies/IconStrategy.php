<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class IconStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'icon'; }
    public function getCategory(): string { return 'Basic'; }
    public function getIcon(): string { return 'dashicons-star-filled'; }

    public function getDefaultProps(): array
    {
        return [
            'name' => 'Heart',
            'size' => '40px',
            'color' => '#0ea5e9',
            'class' => '',
        ];
    }
}
