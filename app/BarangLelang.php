<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;

class BarangLelang extends Model
{
    //
    protected $table = 'barang_lelang';

    protected $fillable = [
        'nama_barang',
        'bukaan_harga',
        'kelipatan',
        'deskripsi',
        'id_toko',
        'kategori',
    ];

    protected $with = [
        'penawaran',
    ];

    protected $appends = [
        'max_bid',
        'foto',
    ];

    public $timestamps = false;

    public function getMaxBidAttribute()
    {
        $max = 0;
        foreach ($this->penawaran as $p) {
            if ($p->harga_penawaran > $max) {
                $max = $p->harga_penawaran;
            }
        }
        return $max;
    }

    public function getFotoAttribute()
    {
        $standardPhotoPath = '/uploads/auction_photo/';
        $path = public_path() . $standardPhotoPath . $this->attributes['id'];
        $matchingFiles = File::glob("{$path}_*.*");

        $foto = array();

        foreach ($matchingFiles as $file) {
            $photo_name = explode('/', $file);
            $foto[] = url($standardPhotoPath . end($photo_name));
        }

        if (!$foto) {
            $foto[] = "https://picsum.photos/id/857/500/337";
        }

        return $foto;
    }

    public function toko()
    {
        return $this->belongsTo('App\TokoLelang', 'id_toko', 'id');
    }

    public function komentar()
    {
        return $this->hasMany('App\KomentarLelang', 'id_barang', 'id')->orderBy('created_at', 'desc');;
    }

    public function penawaran()
    {
        return $this->hasMany('App\PenawaranLelang', 'id_barang', 'id')->orderBy('harga_penawaran', 'desc');
    }

    public function transaksi()
    {
        return $this->hasOne('App\Transaksi', 'id_barang', 'id');
    }
}
