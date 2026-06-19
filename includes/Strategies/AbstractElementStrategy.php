<?php
namespace Jankx\Extensions\FlatsomeCompatible\Strategies;

use Jankx\Extensions\FlatsomeCompatible\Contracts\ElementTypeStrategy;

abstract class AbstractElementStrategy implements ElementTypeStrategy
{
    public function getLabel(): string
    {
        return ucfirst($this->getType());
    }

    public function render(array $props, array $children = []): string
    {
        return '';
    }

    public function getShortcode(array $props): string
    {
        $attrs = [];
        foreach ($props as $key => $value) {
            if ($value !== null && $value !== '' && $value !== false) {
                $attrs[] = sprintf('%s="%s"', $key, esc_attr(is_array($value) ? implode(',', $value) : $value));
            }
        }
        $attrsStr = !empty($attrs) ? ' ' . implode(' ', $attrs) : '';
        return sprintf('[%s%s]', $this->getType(), $attrsStr);
    }
}
