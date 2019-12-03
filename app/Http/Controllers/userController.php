<?php

namespace App\Http\Controllers;

use App\AlamatPengiriman;
use App\Pengguna;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Pengguna::where('username', $request->user->username)->first();
            if ($user) {
                return response()->json([
                    'status' => true,
                    'data' => $user,
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Pengguna tidak ditemukan',
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
            return response()->json($e->getMessage(), $e->status ?? 500);
        }
    }

    protected function jwt(Pengguna $pengguna)
    {
        $payload = [
            'iss' => "lelang-in", // Issuer of the token
            'username' => $pengguna->username, // Subject of the token
            'iat' => time(), // Time when JWT was issued.
            'exp' => time() + (60 * 60 * 24 * 365), // Expiration time
        ];

        // As you can see we are passing `JWT_SECRET` as the second parameter that will
        // be used to decode the token in the future.
        return JWT::encode($payload, env('SECRET_TOKEN_KEY'), 'HS256');
    }

    public function getOneUser($username)
    {
        try {
            $user = Pengguna::find($username);
            if ($user) {
                return response()->json([
                    'status' => true,
                    'data' => $user,
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Pengguna tidak ditemukan',
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
            return response()->json($e->getMessage(), $e->status ?? 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'username' => 'max:32',
                'password' => 'required',
            ]);
            $data = Pengguna::where('username', $validatedData['username'])->first();
            if ($data) {
                if (Hash::check($validatedData['password'], $data->password)) {
                    $jwt = $this->jwt($data);

                    return response()->json([
                        'status' => true,
                        'token' => $jwt,
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Email atau Username atau Password salah',
                    ], 404);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Email atau Username atau Password salah',
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
            return response()->json($e->getMessage(), $e->status ?? 500);
        }
    }

    public function daftar(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'username' => 'required|alpha_dash',
                'email' => 'required',
                'nama' => 'required',
                'password' => 'required',
                'tanggal_lahir' => 'required',
            ]);

            $pengguna = Pengguna::create([
                'username' => $validatedData['username'],
                'email' => $validatedData['email'],
                'nama' => $validatedData['nama'],
                'password' => bcrypt($validatedData['password']),
                'tanggal_lahir' => $validatedData['tanggal_lahir'],
            ]);

            if ($pengguna) {
                return response()->json([
                    'status' => true,
                    'message' => 'Registrasi berhasil',
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Registrasi gagal',
                ], 400);
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
            return response()->json($e->getMessage(), $e->status ?? 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'email' => 'required',
                'nama' => 'required',
                'tanggal_lahir' => 'required',
            ]);

            $project = Pengguna::where('username', $request->user->username)->first();

            if ($project) {
                $project->email = $validatedData['email'];
                $project->nama = $validatedData['nama'];
				$project->tanggal_lahir = $validatedData['tanggal_lahir'];

                $project->save();
                return response()->json([
                    'status' => true,
                    'message' => 'Pembaruan profil berhasil',
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Pengguna tidak ditemukan',
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
            return response()->json($e->getMessage(), $e->status ?? 500);
        }
    }

    public function changePassword(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'old_password' => 'required',
                'new_password' => 'required',
            ]);

            $project = Pengguna::where('username', $request->user->username)->first();

            if ($project) {
                if (Hash::check($validatedData['old_password'], $project->password)) {
                    $project->password = $validatedData['new_password'];

                    $project->save();
                    return response()->json([
                        'status' => true,
                        'message' => 'Penggantian password berhasil',
                    ], 200);
                } else {
					return response()->json([
						'status' => false,
						'message' => 'Password lama tidak sesuai',
					], 400);
				}
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Pengguna tidak ditemukan',
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
            return response()->json($e->getMessage(), $e->status ?? 500);
        }
    }

    public function uploadPhoto(Request $request)
    {
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            if ($photo->isValid()) {
                if (stripos($photo->getMimeType(), 'image') !== false) {
                    $photo->move(public_path() . '/uploads/profile_photo/',
                        $request->user->username . '.' . $photo->getClientOriginalExtension());
                    return response()->json([
                        'status' => true,
                        'message' => 'Foto profil berhasil diperbarui',
                    ]);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Format berkas tidak sesuai',
                    ], 400);
                }
            }
        }
        return response()->json([
            'status' => false,
            'message' => 'Pengunggahan foto gagal',
        ], 400);
    }

    public function addAddress(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nama_penerima' => 'required|max:255',
                'no_telepon' => 'required',
                'nama_jalan' => 'required|max:255',
                'kelurahan' => 'required|max:255',
                'kode_pos' => 'required|integer',
            ]);

            $pengguna = AlamatPengiriman::create([
                'username_pengguna' => $request->user->username,
                'nama_penerima' => $validatedData['nama_penerima'],
                'no_telepon' => $validatedData['no_telepon'],
                'nama_jalan' => $validatedData['nama_jalan'],
                'kelurahan' => $validatedData['kelurahan'],
                'kode_pos' => $validatedData['kode_pos'],
            ]);

            if ($pengguna) {
                return response()->json([
                    'status' => true,
                    'message' => 'Alamat berhasil ditambahkan',
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Registrasi gagal',
                ], 400);
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
            return response()->json($e->getMessage(), $e->status ?? 500);
        }
    }

    public function getUserAddress(Request $request)
    {
        try {
            $alamat_pengiriman = AlamatPengiriman::where('username_pengguna', $request->user->username)->get();

            return response()->json([
                'status' => true,
                'data' => $alamat_pengiriman,
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

    public function updateAddress(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'nama_penerima' => 'required|max:255',
                'no_telepon' => 'required',
                'nama_jalan' => 'required|max:255',
                'kelurahan' => 'required|max:255',
                'kode_pos' => 'required|integer',
            ]);

            $alamat_pengiriman = AlamatPengiriman::where('id', $id)->first();

            if ($alamat_pengiriman) {
                if ($alamat_pengiriman->username_pengguna == $request->user->username) {
                    $alamat_pengiriman->nama_penerima = $validatedData['nama_penerima'];
                    $alamat_pengiriman->no_telepon = $validatedData['no_telepon'];
                    $alamat_pengiriman->nama_jalan = $validatedData['nama_jalan'];
                    $alamat_pengiriman->kelurahan = $validatedData['kelurahan'];
                    $alamat_pengiriman->kode_pos = $validatedData['kode_pos'];

                    $alamat_pengiriman->save();
                    return response()->json([
                        'status' => true,
                        'message' => 'Pembaruan alamat pengiriman berhasil',
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Anda tidak memiliki izin',
                    ], 403);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Alamat tidak ditemukan',
                ], 400);
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
            return response()->json($e->getMessage(), $e->status ?? 500);
        }
    }

    public function deleteAddress(Request $request, $id)
    {
        try {

            $alamat_pengiriman = AlamatPengiriman::where('id', $id)->first();

            if ($alamat_pengiriman) {
                if ($alamat_pengiriman->username_pengguna == $request->user->username) {
                    $alamat_pengiriman->delete();

                    return response()->json([
                        'status' => true,
                        'message' => 'Alamat berhasil dihapus',
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Anda tidak memiliki izin',
                    ], 403);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Alamat tidak ditemukan',
                ], 400);
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
            return response()->json($e->getMessage(), $e->status ?? 500);
        }
    }
}
