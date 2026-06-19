<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class ColumnStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'column'; }
    public function getCategory(): string { return 'Layout'; }
    public function getIcon(): string { return 'dashicons-columns'; }

    public function getDefaultProps(): array
    {
        return [
            'span' => 4,
            'bg_color' => '',
            'padding' => '15px',
            'text_align' => 'left',
            'class' => '',
        ];
    }
}
