// Copyright (c) 2019, Fivo and contributors
// For license information, please see license.txt

frappe.ui.form.on('Master Pelanggan', {
	join_date: function(frm) {
		if (frm.doc.join_date > get_today()) {
			frm.set_value('join_date','');
			frappe.throw(__("You can not select future date in Join Date"));
			frappe.validated = false;
		}
	}
});