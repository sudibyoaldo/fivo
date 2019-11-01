// Copyright (c) 2019, Fivo and contributors
// For license information, please see license.txt

frappe.ui.form.on("Transaksi Line", {

	jumlah_produk: function(frm,cdt, cdn){
		jumlah_total(frm, cdt, cdn);
	},

	harga_produk: function(frm, cdt, cdn){
		jumlah_total(frm, cdt, cdn);
	}
});

let jumlah_total = function(frm, cdt, cdn) {
let d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "sub_total", d.jumlah_produk * d.harga_produk);
}

frappe.ui.form.on("Transaksi Line", "sub_total", function(frm, cdt, cdn) {

   let sub_total = frm.doc.data_produk
   let total_harga = 0
   for(let a in sub_total) {
	total_harga = total_harga + sub_total[a].sub_total
	}

	frm.set_value("total_belanja",total_harga)
})

frappe.ui.form.on("Transaksi",{
	point_use:function(frm){
		let total_bayar = frm.doc.total_belanja - frm.doc.point_use
		frm.set_value("total_bayar",total_bayar);
		// frappe.call({
		// 	method: "frappe.client.get",
		// 	args:{
		// 		doctype : "Point",
		// 		name: frm.doc.id_point
		// 	},
		// 	callback:function(r){
		// 		if(r.message.total_point < frm.doc.point_use){
		// 			frm.set_value('point_use','');
		// 			frappe.throw('Point tidak mencukupi');
		// 		}
		// 		else{
		// 			frm.set_value("total_bayar",total_bayar);
		// 		}
		// 	}

		// }),
		frappe.call({
			method: "frappe.client.get",
			args:{
				doctype : "Master Pelanggan",
				name: frm.doc.id_pelanggan
			},
			callback:function(r){
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

				}
			}
		})
	}
});