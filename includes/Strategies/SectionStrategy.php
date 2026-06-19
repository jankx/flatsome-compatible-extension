<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class SectionStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'section'; }
    public function getCategory(): string { return 'Layout'; }
    public function getIcon(): string { return 'dashicons-layout'; }

    public function getDefaultProps(): array
    {
        return [
            'bg_color' => '#f8fafc',
            'bg_image' => '',
            'padding_top' => '60px',
            'padding_bottom' => '60px',
            'overlay' => 'rgba(0,0,0,0)',
            'class' => '',
        ];
    }
}
