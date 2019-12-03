<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;

class TokoLelang extends Model
{
    //
    protected $table = 'toko_lelang';

    protected $fillable = [
        'username_pengguna',
        'nama_toko',
        'no_telepon',
        'nama_jalan',
        'kelurahan',
        'kode_pos',
    ];

    public $timestamps = false;

    protected $appends = ['foto'];

    public function pemilik()
    {
        return $this->belongsTo('App\Pengguna', 'username_pengguna', 'username');
    }

    public function barang()
    {
        return $this->hasMany('App\BarangLelang', 'id_toko', 'id');
    }

    public function getFotoAttribute()
    {

        $standardPhotoPath = '/uploads/shop_photo/';
        $path = public_path() . $standardPhotoPath . $this->attributes['username_pengguna'];
        $matchingFiles = File::glob("{$path}.*");
        if ($matchingFiles) {
            $photo_name = explode('/', $matchingFiles[0]);
            return url($standardPhotoPath . end($photo_name));
        } else {
            return 'http://www.stickpng.com/assets/images/585e4bf3cb11b227491c339a.png';
        }
    }
}
