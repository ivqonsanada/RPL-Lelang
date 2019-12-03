const BASE_API = 'http://127.0.0.1:8000/api';

const API_CONSTANT = {
    "login": `${BASE_API}/login/`,
    "register": `${BASE_API}/daftar/`,
    "users": `${BASE_API}/pengguna/`,
    "add_address": `${BASE_API}/tambah-alamat-pengiriman/`,
    "alamat_pengiriman": `${BASE_API}/alamat-pengiriman`,
    "upload_photo_profile": `${BASE_API}/unggah-foto-profil/`,
    "toko": `${BASE_API}/toko/`,
    "cek_toko": `${BASE_API}/cek-toko/`,
    "barang": `${BASE_API}/barang/`,
    "barang_detail": `${BASE_API}/barangdetail/`,
    "hot_item": `${BASE_API}/hotItem/`,
    "rekomen": `${BASE_API}/rekomen/`,
    "sold": `${BASE_API}/sold/`,
    "penawaran_lelang": `${BASE_API}/penawaran-lelang/`,
    "transaksi": `${BASE_API}/transaksi/`,
}


export default API_CONSTANT;
