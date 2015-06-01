/* jshint node: true, jquery: true */
/* global Meteor, ReactiveVar, Session, Template, Iron, Router, moment,
          Customers, Invoices, InvoiceItems, Items, ItemPrices */
'use strict';

var date = moment().format('YYYY-MM-DD');
Session.set('invoices_new_start', date);
Session.set('invoices_new_end', date);

Template.Invoices.onCreated(function() {
  this.displayArchived = new ReactiveVar(false);
});

Template.Invoices.events({
  'click #invoices_new_invoice': function() {
    Router.go('invoices.new');
  },
  'click #invoices_toggle_display_archived': function(event, template) {
    var value = Template.instance().displayArchived.get();
    Template.instance().displayArchived.set(!value);
  }
});

Template.Invoices.helpers({
  invoices: function() {
    var selector = {
      userId: Meteor.userId()
    };

    if (!Template.instance().displayArchived.get()) {
      selector.active = true;
    }

    return Invoices.find(selector, {
      sort: {
        start: -1
      }
    });
  },
  displayArchived: function() {
    return Template.instance().displayArchived.get();
  }
});

Template.InvoicesNew.onCreated(function() {
  this.startError = new ReactiveVar('');
  this.endError = new ReactiveVar('');
  this.companyError = new ReactiveVar('');
  this.customerError = new ReactiveVar('');
  this.servicesError = new ReactiveVar('');
  this.termsError = new ReactiveVar('');
  this.percentageError = new ReactiveVar('');

  var user = Meteor.user();
  var companyDefault = false;
  if (user) {
    companyDefault = user.profile.company;
  }
  this.company = new ReactiveVar(companyDefault);
  this.customer = new ReactiveVar('');
});

Template.InvoicesNew.onRendered(function() {
  $('#invoices_new_daterange').datepicker({
    format: "yyyy-mm-dd",
    orientation: "top auto"
  });
});

var handleInvoiceError = function(error, template) {
  var attributes = [
    'start', 'end', 'company', 'customer', 'services', 'terms', 'percentage'
  ];

  if (error) {
    attributes.forEach(function(attr) {
      if (error.details[attr]) {
        template[attr+'Error'].set(error.details[attr]);
      } else {
        template[attr+'Error'].set('');
      }
    });

    return true;
  } else {
    attributes.forEach(function(attr) {
      template[attr+'Error'].set('');
    });

    return false;
  }
};

Template.InvoicesNew.events({
  'change #invoices_new_start': function(event, template) {
    Session.set('invoices_new_start', $('#invoices_new_start').val());
  },
  'change #invoices_new_end': function(event, template) {
    Session.set('invoices_new_end', $('#invoices_new_end').val());
  },
  'click #invoices_new_create_invoice': function(event, template) {
    var start = template.find('#invoices_new_start').value;
    var end = template.find('#invoices_new_end').value;
    var company = template.find('#invoices_new_company').value;
    var customer = template.find('#invoices_new_customer').value;
    var services = template.find('#invoices_new_services').value;
    var terms = template.find('#invoices_new_terms').value;
    var percentage = template.find('#invoices_new_percentage').value;

    Meteor.call(
      'createInvoice',
      {
        start: start,
        end: end,
        company: company,
        customer: customer,
        services: services,
        terms: terms,
        percentage: percentage
      },
      function(error, result) {
        if (!handleInvoiceError(error, template)) {
          Router.go('invoices.show', {_id: result.id});
        }
      }
    );
  },
  'click #invoices_new_cancel': function(event, template) {
    Router.go('invoices');
  },
  'click #invoices_new_create_customer': function(event, template) {
    Router.go('customers.new', {}, {query: "route=invoices.new"});

    event.preventDefault();
    return true;
  },
  'click .invoices_new_customer_option': function(event, template) {
    template.find('#invoices_new_customer').value = this.description;
    template.find('#invoices_new_percentage').value = this.percentage;

    Template.instance().customer.set(this.description);

    event.preventDefault();
    return true;
  },
  'click .invoices_new_terms_option': function(event, template) {
    template.find('#invoices_new_terms').value = this;

    event.preventDefault();
    return true;
  },
  'keyup, change #invoices_new_company': function(event, template) {
    var company = template.find('#invoices_new_company').value;

    Template.instance().company.set(company);

    return true;
  },
  'keyup, change #invoices_new_customer': function(event, template) {
    var customer = template.find('#invoices_new_customer').value;

    Template.instance().customer.set(customer);

    return true;
  }
});

Template.InvoicesNew.helpers({
  startError: function() {
    return Template.instance().startError.get();
  },
  endError: function() {
    return Template.instance().endError.get();
  },
  companyError: function() {
    return Template.instance().companyError.get();
  },
  customerError: function() {
    return Template.instance().customerError.get();
  },
  servicesError: function() {
    return Template.instance().servicesError.get();
  },
  termsError: function() {
    return Template.instance().termsError.get();
  },
  percentageError: function() {
    return Template.instance().percentageError.get();
  },
  start: function () {
    return Session.get('invoices_new_start');
  },
  end: function() {
    return Session.get('invoices_new_end');
  },
  company: function() {
    return Template.instance().company.get();
  },
  customer: function() {
    return Template.instance().customer.get();
  },
  customers: function() {
    return Customers.find({userId: Meteor.userId(), active: true}, {
      sort: {
        name: 1
      }
    });
  },
  services: function() {
    var user = Meteor.user();
    if (user) {
      return user.profile.services;
    } else {
      return false;
    }
  },
  terms: function() {
    return [
      'Weekly',
      'Biweekly',
      'Twice Monthly',
      'Monthly'
    ];
  }
});

Template.InvoicesEdit.onCreated(function() {
  this.startError = new ReactiveVar('');
  this.endError = new ReactiveVar('');
  this.companyError = new ReactiveVar('');
  this.customerError = new ReactiveVar('');
  this.servicesError = new ReactiveVar('');
  this.termsError = new ReactiveVar('');
  this.percentageError = new ReactiveVar('');

  this.company = new ReactiveVar('');
  this.customer = new ReactiveVar('');
});

Template.InvoicesEdit.onRendered(function() {
  $('#invoices_edit_daterange').datepicker({
    format: "yyyy-mm-dd",
    orientation: "top auto"
  });

  var self = this;
  var id = Iron.controller().params._id;

  this.subscribe('invoices', function() {
    var invoice = Invoices.findOne(id);
    self.company.set(invoice.company);
    self.customer.set(invoice.customer);
  });
});

Template.InvoicesEdit.events({
  'click #invoices_edit_update_invoice': function(event, template) {
    var start = template.find('#invoices_edit_start').value;
    var end = template.find('#invoices_edit_end').value;
    var company = template.find('#invoices_edit_company').value;
    var customer = template.find('#invoices_edit_customer').value;
    var services = template.find('#invoices_edit_services').value;
    var terms = template.find('#invoices_edit_terms').value;
    var percentage = template.find('#invoices_edit_percentage').value;

    var id = Iron.controller().params._id;
    Meteor.call(
      'updateInvoice',
      id,
      {
        start: start,
        end: end,
        company: company,
        customer: customer,
        services: services,
        terms: terms,
        percentage: percentage
      },
      function(error, result) {
        if (!handleInvoiceError(error, template)) {
          Router.go('invoices.show', {_id: id});
        }
      }
    );
  },
  'click #invoices_edit_cancel': function(event, template) {
    var id = Iron.controller().params._id;
    Router.go('invoices.show', {_id: id});
  },
  'keyup, change #invoices_edit_company': function(event, template) {
    var company = template.find('#invoices_edit_company').value;

    Template.instance().company.set(company);

    return true;
  },
  'keyup, change #invoices_edit_customer': function(event, template) {
    var customer = template.find('#invoices_edit_customer').value;

    Template.instance().customer.set(customer);

    return true;
  }
});

Template.InvoicesEdit.helpers({
  startError: function() {
    return Template.instance().startError.get();
  },
  endError: function() {
    return Template.instance().endError.get();
  },
  companyError: function() {
    return Template.instance().companyError.get();
  },
  customerError: function() {
    return Template.instance().customerError.get();
  },
  servicesError: function() {
    return Template.instance().servicesError.get();
  },
  termsError: function() {
    return Template.instance().termsError.get();
  },
  percentageError: function() {
    return Template.instance().percentageError.get();
  },
  invoice: function() {
    var id = Iron.controller().params._id;
    return Invoices.findOne(id);
  },
  company: function() {
    return Template.instance().company.get();
  },
  customer: function() {
    return Template.instance().customer.get();
  }
});

Template.InvoicesShow.helpers({
  invoice: function() {
    var id = Iron.controller().params._id;
    return Invoices.findOne(id);
  },
  termsClass: function() {
    var id = Iron.controller().params._id;
    var invoice = Invoices.findOne(id);
    if (invoice) {
      return invoice.active ? 'active' : 'disabled';
    } else {
      return false;
    }
  }
});

Template.InvoicesShow.events({
  'click #invoices_show_edit_invoice': function(event, template) {
    var id = Iron.controller().params._id;
    Router.go('invoices.edit', {_id: id});
  },
  'click #invoices_show_remove_invoice': function() {
    var id = Iron.controller().params._id;
    Meteor.call('archiveInvoice', id);
  }
});

Template.invoiceItems.events({
  'click #invoice_items_new_invoice_item': function() {
    var invoiceId = Iron.controller().params._id;
    Meteor.call('createInvoiceItem', invoiceId);
  }
});

Template.invoiceItems.helpers({
  items: function() {
    var id = Iron.controller().params._id;
    return InvoiceItems.find({invoiceId: id});
  },
  totalPrice: function() {
    var id = Iron.controller().params._id;
    var invoiceItems = InvoiceItems.find({invoiceId: id});
    var total = 0;

    invoiceItems.forEach(function(invoiceItem, index) {
      var item = Items.findOne(invoiceItem.itemId);
      if (item) {
        var price = item.price;

        var itemPrices = ItemPrices.find({
          itemId: invoiceItem.itemId,
          untilDate: {$gte: Template.currentData().end}
        }, {
          sort: {
            untilDate: -1
          }
        }).fetch();

        if (itemPrices.length > 0) {
          price = itemPrices[0].price;
        }

        if (price) {
          price = invoiceItem.quantity * price;
        }

        total += price;
      }
    });

    return total / 100;
  }
});

Template.invoiceItem.onCreated(function() {
  var hasItem = (Template.currentData().itemId === null);
  this.editing = new ReactiveVar(hasItem);
  this.quantityError = new ReactiveVar('');
});

Template.invoiceItem.events({
  'click .invoice_item_edit_invoice_item': function(event, template) {
    template.editing.set(true);
  },
  'click .invoice_item_remove_invoice_item': function(event, template) {
    var id = template.data._id;
    Meteor.call('removeInvoiceItem', id);
  },
  'click .invoice_item_edit_done': function(event, template) {
    var error = false;
    var id = template.data._id;
    var item = template.find('#invoice_item_item_' + id).value;
    var quantity = template.find('#invoice_item_quantity_' + id).value;

    if (quantity === null || quantity.length === 0) {
      template.quantityError.set('Quantity is required and must be numeric');
      error = true;
    } else if (!$.isNumeric(quantity)) {
      template.quantityError.set('Quantity must be numeric');
      error = true;
    } else {
      template.quantityError.set('');
    }

    if (error) return;

    Meteor.call(
      'updateInvoiceItem',
      id,
      {
        itemId: item,
        quantity: quantity
      },
      function(error, result) {
        if (error) return;

        template.editing.set(false);
      }
    );
  },
  'click #invoice_item_new_item': function(event, template) {
    Router.go('items.new', {}, {query: "route=invoices.show&_id=" + encodeURIComponent(Iron.controller().params._id)});
  }
});

Template.invoiceItem.helpers({
  isEditing: function() {
    return Template.instance().editing.get();
  },
  quantityError: function() {
    return Template.instance().quantityError.get();
  },
  items: function() {
    return Items.find({userId: Meteor.userId(), active: true}, {
      sort: {
        code: 1
      }
    });
  },
  itemCode: function() {
    var itemId = Template.currentData().itemId,
      code = null;

    if (itemId) {
      code = Items.findOne(itemId).code;
    }

    return code;
  },
  itemDescription: function() {
    var itemId = Template.currentData().itemId,
      description = null;

    if (itemId) {
      description = Items.findOne(itemId).description;
    }

    return description;
  },
  price: function() {
    var invoiceId, itemId, price, invoice, item, itemPrices;

    itemId = Template.currentData().itemId;
    price = null;

    if (itemId) {
      invoiceId = Template.currentData().invoiceId;
      invoice = Invoices.findOne(invoiceId);
      item = Items.findOne(itemId);
      price = item.price;

      itemPrices = ItemPrices.find({
        itemId: itemId,
        untilDate: {$gte: invoice.end}
      }, {
        sort: {
          untilDate: -1
        }
      }).fetch();

      if (itemPrices.length > 0) {
        price = itemPrices[0].price;
      }
    }

    if (price) {
      price = Template.currentData().quantity * price / 100;
    }

    return price;
  },
  itemPrice: function() {
    var invoiceId, itemId, price, invoice, item, itemPrices;

    itemId = Template.currentData().itemId;
    price = null;

    if (itemId) {
      invoiceId = Template.currentData().invoiceId;
      invoice = Invoices.findOne(invoiceId);
      item = Items.findOne(itemId);
      price = item.price;

      itemPrices = ItemPrices.find({
        itemId: itemId,
        untilDate: {$gte: invoice.end}
      }, {
        sort: {
          untilDate: -1
        }
      }).fetch();

      if (itemPrices.length > 0) {
        price = itemPrices[0].price;
      }
    }

    if (price) {
      price = price / 100;
    }

    return price;
  }
});
