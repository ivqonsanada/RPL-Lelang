<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PenawaranLelang extends Model
{
    //
    protected $table = 'penawaran_lelang';

    protected $fillable = [
        'username_pengguna',
        'id_barang',
        'harga_penawaran',
        'created_at',
    ];


    protected $with = [
        'pengguna',
    ];

    public $timestamps = false;

    public function pengguna()
    {
        return $this->belongsTo('App\Pengguna', 'username_pengguna', 'username');
    }

    public function barang()
    {
        return $this->belongsTo('App\BarangLelang', 'id_barang', 'id');
    }

    public function transaksi()
    {
        return $this->hasOne('App\Transaksi', 'id_penawaran', 'id');
    }
}
