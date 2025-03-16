<?php

namespace Phoenixpanel\Models;

use Illuminate\Database\Eloquent\Model;

class MountServer extends Model
{
    protected $table = 'mount_server';

    public $timestamps = false;

    protected $primaryKey;

    public $incrementing = false;
}
