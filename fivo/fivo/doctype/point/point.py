# -*- coding: utf-8 -*-
# Copyright (c) 2019, Fivo and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Point(Document):
	pass
	
	def validate(self):
		self.on_approve()
	
	def on_approve(self):
		if(self.id_pelanggan):
			kirim = frappe.get_doc("Master Pelanggan", self.id_pelanggan)
			if(kirim.total_belanja > 1000000):
				kirim.tipe_pelanggan = 'Bronze'
			elif(kirim.total_belanja > 3000000):
				kirim.tipe_pelanggan = 'Silver'
			elif(kirim.total_belanja > 5000000):
				kirim.tipe_pelanggan = 'Gold'
			kirim.save()