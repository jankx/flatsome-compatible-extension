<?php
namespace Jankx\Extensions\FlatsomeCompatible\Facades;

use Jankx\Extensions\FlatsomeCompatible\FlatsomeCompatibleExtension;

class UxBuilder
{
    protected static $instance;

    protected static function getFacadeAccessor()
    {
        return FlatsomeCompatibleExtension::get_instance();
    }

    public static function getService()
    {
        $extension = self::getFacadeAccessor();
        if ($extension) {
            return $extension->getService();
        }
        return null;
    }

    public static function __callStatic($method, $args)
    {
        $service = self::getService();
        if ($service && method_exists($service, $method)) {
            return call_user_func_array([$service, $method], $args);
        }
        return null;
    }
}
