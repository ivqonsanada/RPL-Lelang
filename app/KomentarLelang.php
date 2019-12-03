<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class KomentarLelang extends Model
{
    //
    protected $table = 'komentar_barang';

    protected $fillable = [
        'username_pengguna',
        'isi',
        'id_barang',
    ];

    public $timestamps = false;

    protected $with = [
        'pengguna',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->created_at = $model->freshTimestamp();
        });
    }

    public function pengguna()
    {
        return $this->belongsTo('App\Pengguna', 'username_pengguna', 'username');
    }

    public function barang()
    {
        return $this->belongsTo('App\BarangLelang', 'id_barang', 'id');
    }
}
