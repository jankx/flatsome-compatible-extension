<?php
namespace Jankx\Extensions\FlatsomeCompatible\Helpers;

class States
{
    public static function isEditor(): bool
    {
        return (
            isset($_GET['app']) &&
            isset($_GET['type']) &&
            $_GET['app'] === 'uxbuilder'
        );
    }

    public static function isIframe(): bool
    {
        return (
            isset($_GET['uxb_iframe']) &&
            $_GET['uxb_iframe'] == '1'
        );
    }

    public static function isActive(): bool
    {
        return self::isEditor() || self::isIframe();
    }
}
