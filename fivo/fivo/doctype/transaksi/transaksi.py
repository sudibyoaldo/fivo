# -*- coding: utf-8 -*-
# Copyright (c) 2019, Fivo and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Transaksi(Document):
	pass

	def on_submit(self):
		self.on_approve()

	def on_approve(self):
		if(self.docstatus == 1):
			pelanggan = frappe.get_doc("Master Pelanggan",self.id_pelanggan)
			pelanggan.total_belanja += self.total_transaksi
			pelanggan.total_point -= self.point_use
			pelanggan.total_point += self.point_get
			if (pelanggan.total_belanja > 1000000):
				pelanggan.tipe_pelanggan = 'Bronze'
				if (pelanggan.total_belanja > 3000000):
					pelanggan.tipe_pelanggan = 'Silver'
					if (pelanggan.total_belanja > 5000000):
						pelanggan.tipe_pelanggan = 'Gold'
			pelanggan.save()
			self.change_stok_produk()
	
	def change_stok_produk(self):
		if(self.data_produk):
			for i in self.data_produk:
				produk = frappe.get_doc("Master Produk",i.id_produk)
				produk.stock_produk = produk.stock_produk - i.jumlah_produk
				produk.save()