<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use PhoenixPanel\Models\AdSetting;

class AdSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create default ad settings if they don't exist
        if (!AdSetting::count()) {
            AdSetting::create([
                'enabled' => false,
                'header_ad_code' => '<script type="text/javascript">
    atOptions = {
        \'key\' : \'c9cf21b40a2ca7a712838aa159302d54\',
        \'format\' : \'iframe\',
        \'height\' : 90,
        \'width\' : 728,
        \'params\' : {}
    };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/c9cf21b40a2ca7a712838aa159302d54/invoke.js"></script>',
                'sidebar_ad_code' => '<script type="text/javascript">
    atOptions = {
        \'key\' : \'c9cf21b40a2ca7a712838aa159302d54\',
        \'format\' : \'iframe\',
        \'height\' : 250,
        \'width\' : 300,
        \'params\' : {}
    };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/c9cf21b40a2ca7a712838aa159302d54/invoke.js"></script>',
                'content_ad_code' => '<script type="text/javascript">
    atOptions = {
        \'key\' : \'c9cf21b40a2ca7a712838aa159302d54\',
        \'format\' : \'iframe\',
        \'height\' : 90,
        \'width\' : 728,
        \'params\' : {}
    };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/c9cf21b40a2ca7a712838aa159302d54/invoke.js"></script>',
                'footer_ad_code' => '<script type="text/javascript">
    atOptions = {
        \'key\' : \'c9cf21b40a2ca7a712838aa159302d54\',
        \'format\' : \'iframe\',
        \'height\' : 90,
        \'width\' : 728,
        \'params\' : {}
    };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/c9cf21b40a2ca7a712838aa159302d54/invoke.js"></script>',
            ]);
        }
    }
}