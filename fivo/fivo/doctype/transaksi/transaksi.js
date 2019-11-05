// Copyright (c) 2019, Fivo and contributors
// For license information, please see license.txt

//Validasi Tanggal
frappe.ui.form.on('Transaksi',{
	tanggal_transaksi: function(frm){
		if (frm.doc.tanggal_transaksi < get_today()) {
			frm.set_value('tanggal_transaksi','')
			frappe.throw(__("You can not select past date in Tanggal Transaksi"));
			frappe.validated = false;
		}
		if (frm.doc.tanggal_transaksi > get_today()) {
			frm.set_value('tanggal_transaksi','')
			frappe.throw(__("You can not select future date in Tanggal Transaksi"));
			frappe.validated = false;
		}
	}
})

//Mengdefinisikan variable jumlah_total
frappe.ui.form.on("Transaksi Line", {

	jumlah_produk: function(frm,cdt, cdn){
		jumlah_total(frm, cdt, cdn);
		validasi_jumlah_pembelian(frm, cdt, cdn);
	},

	harga_produk: function(frm, cdt, cdn){
		jumlah_total(frm, cdt, cdn);
	}

});

//Validasi Jumlah Pembelian
let validasi_jumlah_pembelian = function(frm, cdt, cdn) {
	let child = locals[cdt][cdn];
	let stock_produk = child.stock_produk;
	let jumlah_produk = child.jumlah_produk;

	if (jumlah_produk > stock_produk) {
		frappe.model.set_value(cdt, cdn, 'jumlah_produk', '');
		frappe.throw('Stock Tidak Tersedia');
	} 
	else if (jumlah_produk < 1) {
		frappe.model.set_value(cdt, cdn, 'jumlah_produk', '');
		frappe.throw('Jumlah Produk Tidak Boleh Kurang Dari 0');
	} 
	else {
		frappe.model.set_value(cdt, cdn, 'jumlah_produk', jumlah_produk);
	}
}

//Menghitung total harga per barang
let jumlah_total = function(frm, cdt, cdn) {
let d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "sub_total", d.jumlah_produk * d.harga_produk);

}

//Menghitung total_transaksi
frappe.ui.form.on("Transaksi Line", "sub_total", function(frm, cdt, cdn) {

   let sub_total = frm.doc.data_produk
   let total_harga = 0
   for(let a in sub_total) {
	total_harga = total_harga + sub_total[a].sub_total
	}

	frm.set_value("total_transaksi",total_harga)
})

//Menghitung estimasi point didapat yang disesuaikan dengan tipe pelanggan
frappe.ui.form.on("Transaksi",{
	point_use:function(frm){
		let total_bayar = frm.doc.total_transaksi - frm.doc.point_use
		frappe.call({
			method: "frappe.client.get",
			args:{
				doctype : "Master Pelanggan",
				name: frm.doc.id_pelanggan
			},
			callback:function(r){
				if(r.message.total_point < frm.doc.point_use){
						frm.set_value('point_use','');
						frappe.throw('Point tidak mencukupi');
				}
				else{
					frm.set_value("total_bayar",total_bayar);
					if (r.message.tipe_pelanggan == 'Gold'){
						let dapet_point = frm.doc.total_bayar * 0.07
						frm.set_value("point_get",dapet_point)
					}
					else if (r.message.tipe_pelanggan == 'Silver'){
						let dapet_point = frm.doc.total_bayar * 0.05
						frm.set_value("point_get",dapet_point)
					}
					else if (r.message.tipe_pelanggan == 'Bronze'){
						let dapet_point = frm.doc.total_bayar * 0.03
						frm.set_value("point_get",dapet_point)
					}
					else{
						let dapet_point = 0
						frm.set_value("point_get",dapet_point)
					}
				}
			}
		})
	}
});
