<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

class GapStrategy extends AbstractElementStrategy
{
    public function getType(): string { return 'gap'; }
    public function getCategory(): string { return 'Basic'; }
    public function getIcon(): string { return 'dashicons-editor-expand'; }

    public function getDefaultProps(): array
    {
        return [
            'height' => '30px',
            'class' => '',
        ];
    }
}
