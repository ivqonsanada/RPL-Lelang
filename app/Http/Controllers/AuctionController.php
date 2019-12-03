<?php

namespace App\Http\Controllers;

use App\BarangLelang;
use App\KomentarLelang;
use App\PenawaranLelang;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AuctionController extends Controller
{
    //

    public function createAuction(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nama_barang' => 'required|max:255',
                'deskripsi' => 'string|nullable',
                'kategori' => 'required|max:255',
                'bukaan_harga' => 'numeric|nullable',
                'kelipatan' => 'numeric|nullable',
                'waktu_mulai' => 'required|after:now',
                'waktu_akhir' => 'required|after:waktu_mulai|nullable',
                'photo.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            $barang_lelang = new BarangLelang;
            $barang_lelang->nama_barang = $validatedData['nama_barang'];
            $barang_lelang->deskripsi = $validatedData['deskripsi'];
            $barang_lelang->kategori = $validatedData['kategori'];
            $barang_lelang->bukaan_harga = $validatedData['bukaan_harga'] ?? 0;
            $barang_lelang->waktu_mulai = $validatedData['waktu_mulai'];

            if (isset($validatedData['kelipatan'])) {
                $barang_lelang->kelipatan = $validatedData['kelipatan'];
            }

            // if (isset($validatedData['waktu_akhir'])) {
            //     $barang_lelang->waktu_akhir = $validatedData['waktu_akhir'];
            // }

            $barang_lelang->jumlah_dilihat = 0;
            $barang_lelang->id_toko = $request->toko->id;
            $barang_lelang->save();

            if ($request->hasfile('photo')) {
                foreach ($request->file('photo') as $photo) {
                    $photo->move(
                        public_path() . '/uploads/auction_photo/',
                        $barang_lelang->id . '_' . uniqid() . '.' . $photo->getClientOriginalExtension()
                    );
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Barang lelang berhasil didaftarkan',
            ]);
        } catch (\Exception $e) {
            $errorData = ['status' => false];

            if (empty($e->status)) {
                if (isset($e->errorInfo[1])) {
                    switch ($e->errorInfo[1]) {
                        case 1216:
                            $errorData['message'] = 'Data toko pengguna tidak valid';
                            break;
                        default:
                            $errorData['message'] = 'Terjadi kesalahan pada database';
                            break;
                    }
                } else {
                    $errorData['message'] = 'Terjadi kesalahan pada server';
                }
            } else {
                $errorData['message'] = 'Input data tidak valid';
            }
            return response()->json($errorData, $e->status ?? 500);
        }
    }

    public function getShopAuction($idToko)
    {
        try {
            $barangLelang = BarangLelang::where('id_toko', $idToko)->get();

            if ($barangLelang) {
                return response()->json($barangLelang);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Data tidak ditemukan',
                ], 404);
            }
        } catch (\Exception $e) {
            $errorData = ['status' => false];

            if (isset($e->errorInfo[1])) {
                switch ($e->errorInfo[1]) {
                    default:
                        $errorData['message'] = 'Terjadi kesalahan pada database';
                        break;
                }
            } else {
                $errorData['message'] = 'Terjadi kesalahan pada server';
            }
            return response()->json($errorData, $e->status ?? 500);
        }
    }

    public function getRekomen()
    {
        try {
            $barangLelang = BarangLelang::whereDate('waktu_akhir', '>', Carbon::now()->toDateTimeString())->orderBy('id', 'DESC')
                ->limit(8)
                ->get();

            if ($barangLelang) {
                return response()->json($barangLelang);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Data tidak ditemukan',
                ], 404);
            }
        } catch (\Exception $e) {
            $errorData = ['status' => false];

            if (isset($e->errorInfo[1])) {
                switch ($e->errorInfo[1]) {
                    default:
                        $errorData['message'] = 'Terjadi kesalahan pada database';
                        break;
                }
            } else {
                $errorData['message'] = 'Terjadi kesalahan pada server';
            }
            return response()->json($errorData, $e->status ?? 500);
        }
    }

    public function getHotItem()
    {
        try {
            $barangLelang = BarangLelang::whereDate('waktu_akhir', '>', Carbon::now())->orderBy('jumlah_dilihat', 'DESC')->limit(4)->get();

            if ($barangLelang) {
                return response()->json($barangLelang);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Data tidak ditemukan',
                ], 404);
            }
        } catch (\Exception $e) {
            $errorData = ['status' => false];

            if (isset($e->errorInfo[1])) {
                switch ($e->errorInfo[1]) {
                    default:
                        $errorData['message'] = 'Terjadi kesalahan pada database';
                        break;
                }
            } else {
                $errorData['message'] = 'Terjadi kesalahan pada server';
            }
            return response()->json($errorData, $e->status ?? 500);
        }
    }

    public function getSold()
    {
        try {
            $barangLelang = BarangLelang::whereDate('waktu_akhir', '<', Carbon::now()->toDateTimeString())->orderBy('jumlah_dilihat', 'DESC')
                ->limit(4)->get();

            if ($barangLelang) {
                return response()->json($barangLelang);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Data tidak ditemukan',
                ], 404);
            }
        } catch (\Exception $e) {
            $errorData = ['status' => false];

            if (isset($e->errorInfo[1])) {
                switch ($e->errorInfo[1]) {
                    default:
                        $errorData['message'] = 'Terjadi kesalahan pada database';
                        break;
                }
            } else {
                $errorData['message'] = 'Terjadi kesalahan pada server';
            }
            return response()->json($errorData, $e->status ?? 500);
        }
    }

    public function readAuction($id)
    {
        try {
            $barangLelang = BarangLelang::where('id', $id)->with(['komentar', 'toko'])->first();

            if ($barangLelang) {
                $barangLelang->jumlah_dilihat = $barangLelang->jumlah_dilihat + 1;
                $barangLelang->save();

                return response()->json([
                    'status' => true,
                    'data' => $barangLelang,
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Data tidak ditemukan',
                ], 404);
            }
        } catch (\Exception $e) {
            $errorData = ['status' => false];

            if (isset($e->errorInfo[1])) {
                switch ($e->errorInfo[1]) {
                    default:
                        $errorData['message'] = 'Terjadi kesalahan pada database';
                        break;
                }
            } else {
                $errorData['message'] = 'Terjadi kesalahan pada server';
            }
            return response()->json($errorData, $e->status ?? 500);
        }
    }

    public function updateAuction(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'nama_barang' => 'required|max:255',
                'deskripsi' => 'string|nullable',
                'kategori' => 'required|max:255',
                'bukaan_harga' => 'numeric|nullable',
                'kelipatan' => 'numeric|nullable',
            ]);

            $barang_lelang = BarangLelang::find($id);

            if ($barang_lelang) {
                if ($barang_lelang->id_toko == $request->toko->id) {
                    $barang_lelang->nama_barang = $validatedData['nama_barang'];
                    $barang_lelang->deskripsi = $validatedData['deskripsi'];
                    $barang_lelang->kategori = $validatedData['kategori'];
                    $barang_lelang->bukaan_harga = $validatedData['bukaan_harga'] ?? 0;
                    $barang_lelang->kelipatan = $validatedData['kelipatan'];

                    $barang_lelang->save();

                    return response()->json([
                        'status' => true,
                        'message' => 'Informasi barang lelang berhasil diperbarui',
                    ]);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Anda tidak memiliki izin',
                    ], 403);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Data tidak ditemukan',
                ], 404);
            }
        } catch (\Exception $e) {
            $errorData = ['status' => false];

            if (empty($e->status)) {
                if (isset($e->errorInfo[1])) {
                    switch ($e->errorInfo[1]) {
                        default:
                            $errorData['message'] = 'Terjadi kesalahan pada database';
                            break;
                    }
                } else {
                    $errorData['message'] = 'Terjadi kesalahan pada server';
                }
            } else {
                $errorData['message'] = 'Input data tidak valid';
            }
            return response()->json($errorData, $e->status ?? 500);
        }
    }

    public function deleteAuction($id, Request $request)
    {
        try {
            $barangLelang = BarangLelang::find($id);

            if ($barangLelang) {
                if ($barangLelang->id_toko == $request->toko->id) {
                    $barangLelang->delete();

                    return response()->json([
                        'status' => true,
                        'message' => 'Barang lelang berhasil dihapus',
                    ]);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Anda tidak memiliki izin',
                    ], 403);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Data tidak ditemukan',
                ], 404);
            }
        } catch (\Exception $e) {
            $errorData = ['status' => false];

            if (isset($e->errorInfo[1])) {
                switch ($e->errorInfo[1]) {
                    default:
                        $errorData['message'] = 'Terjadi kesalahan pada database';
                        break;
                }
            } else {
                $errorData['message'] = 'Terjadi kesalahan pada server';
            }
            return response()->json($errorData, $e->status ?? 500);
        }
    }

    public function searchAuction(Request $request)
    {
        try {
            if ($request->get('all')) {
                $barang = BarangLelang::whereRaw('1 = 1');
            } else {
                $barang = BarangLelang::has('transaksi', '=', 0);
            }

            if ($request->get('keyword')) {
                $barang->where('nama_barang', 'LIKE', '%' . $request->get('keyword') . '%');
            }

            if ($request->get('by')) {
                $barang->where('id_toko', $request->get('by'));
            }

            if ($request->get('sortBy')) {
                switch ($request->get('sortBy')) {
                    case 'name':
                        $barang->orderBy('nama_barang');
                        break;
                    case 'nameDesc':
                        $barang->orderByDesc('nama_barang');
                        break;
                    case 'latestDesc':
                        $barang->orderBy('id');
                        break;
                    case 'latest':
                        $barang->orderByDesc('id');
                        break;
                    case 'popularity':
                        $barang->orderByDesc('jumlah_dilihat');
                        break;
                    case 'popularityDesc':
                        $barang->orderBy('jumlah_dilihat');
                        break;
                }
            }

            $barang = $barang->get();

            if ($request->get('max')) {
                $barang = $barang->filter(function ($element) use ($request) {
                    return $element->max_bid <= $request->get('max');
                });
            }
            if ($request->get('min')) {
                $barang = $barang->filter(function ($element) use ($request) {
                    return $element->max_bid >= $request->get('max');
                });
            }

            $dataCount = count($barang);

            if ($request->get('sortBy')) {
                $barang = collect($barang);

                switch ($request->get('sortBy')) {
                    case 'price':
                        $barang = $barang->sortBy('max_bid');
                        break;
                    case 'priceDesc':
                        $barang = $barang->sortByDesc('max_bid');
                        break;
                }

                $barang = $barang->toArray();
            }

            if ($request->get('perPage')) {
                $temp = $barang;
                $barang = [];
                $page = $request->get('page') ?? 1;
                for ($i = ($page - 1) * $request->get('perPage'); $i < $page * $request->get('perPage'); $i++) {
                    if (isset($temp[$i])) {
                        $barang[] = $temp[$i];
                    } else {
                        break;
                    }
                }
            }

            return response()->json([
                'status' => true,
                'data' => $barang,
                'dataCount' => $dataCount,
            ], 200);
        } catch (\Exception $e) {
            $errorData = ['status' => false];
            if (isset($e->errorInfo[1])) {
                switch ($e->errorInfo[1]) {
                    default:
                        $errorData['message'] = 'Terjadi kesalahan pada database';
                        break;
                }
            } else {
                $errorData['message'] = 'Terjadi kesalahan pada server';
            }
            return response()->json($e->getMessage(), $e->status ?? 500);
        }
    }

    public function placeBid(Request $request, $id)
    {
        try {
            $barangLelang = BarangLelang::find($id);

            if ($barangLelang) {
                if ($request->get('penawaran')) {
                    if ($barangLelang->toko->pemilik->username != $request->user->username) {
                        $validatedData = $request->validate([
                            'penawaran' => 'required|numeric|min:0',
                        ]);
                        $penawaran = $validatedData['penawaran'];

                        // $bidTime = time();
                        // if ($bidTime >= strtotime($barangLelang->waktu_mulai) && $bidTime <= strtotime($barangLelang->waktu_akhir)) {
                        if ($penawaran > $barangLelang->max_bid && $penawaran > $barangLelang->bukaan_harga) {
                            if ($barangLelang->kelipatan && $penawaran % $barangLelang->kelipatan != 0) {
                                return response()->json([
                                    'status' => false,
                                    'message' => 'Kelipatan penawaran tidak sesuai',
                                ], 422);
                            }

                            $penawaranLelang = new PenawaranLelang;
                            $penawaranLelang->id_barang = $id;
                            $penawaranLelang->harga_penawaran = $penawaran;
                            $penawaranLelang->username_pengguna = $request->user->username;
                            $penawaranLelang->save();

                            return response()->json([
                                'status' => true,
                                'message' => 'Penawaran barang berhasil dimasukkan',
                            ]);
                        } else {
                            return response()->json([
                                'status' => false,
                                'message' => 'Harga penawaran tidak valid',
                            ], 400);
                        }
                    } else {
                        return response()->json([
                            'status' => false,
                            'message' => 'Anda tidak bisa menawar barang Anda sendiri',
                        ], 400);
                    }
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Input data tidak valid',
                    ], 422);
                }
                // } else {
                //     return response()->json([
                //         'status' => false,
                //         'message' => 'Anda tidak bisa menawar barang Anda sendiri',
                //     ], 403);
                // }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Data tidak ditemukan',
                ], 404);
            }
        } catch (\Exception $e) {
            $errorData = ['status' => false];

            if (empty($e->status)) {
                if (isset($e->errorInfo[1])) {
                    switch ($e->errorInfo[1]) {
                        default:
                            $errorData['message'] = 'Terjadi kesalahan pada database';
                            break;
                    }
                } else {
                    $errorData['message'] = 'Terjadi kesalahan pada server';
                }
            } else {
                $errorData['message'] = 'Input data tidak valid';
            }

            return response()->json($errorData, $e->status ?? 500);
        }
    }

    public function commentAuction(Request $request, $id)
    {
        // try {
        $validatedData = $request->validate([
            'isi' => 'required',
        ]);

        $komentar = new KomentarLelang;
        $komentar->username_pengguna = $request->user->username;
        $komentar->isi = $validatedData['isi'];
        $komentar->id_barang = $id;

        $komentar->save();

        return response()->json([
            'status' => true,
            'message' => 'Komentar berhasil dikirim',
        ]);
        // } catch (\Exception $e) {
        //     $errorData = ['status' => false];

        //     if (empty($e->status)) {
        //         if (isset($e->errorInfo[1])) {
        //             switch ($e->errorInfo[1]) {
        //                 case 1216:
        //                     $errorData['message'] = 'Data pengguna tidak valid';
        //                     $e->status = 400;
        //                     break;
        //                 default:
        //                     $errorData['message'] = 'Terjadi kesalahan pada database';
        //                     break;
        //             }
        //         } else {
        //             $errorData['message'] = 'Terjadi kesalahan pada server';
        //         }
        //     } else {
        //         $errorData['message'] = 'Input data tidak valid';
        //     }

        //     return response()->json($errorData, $e->status ?? 500);
        // }
    }
}
