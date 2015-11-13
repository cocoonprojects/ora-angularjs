angular.module('oraApp.accounting')
	.filter('transactionSource', function() {
		return function(type, payer, payee) {
			switch (type) {
				case 'Withdrawal':
					return 'Withdrawal by ' + payee;
				case 'IncomingTransfer':
					return 'Incoming Transfer from ' + payer;
				case 'OutgoingTransfer':
					return 'Outgoing Transfer to ' + payee;
				case 'Deposit':
					return 'Deposit by ' + payer;
				default :
					return type;
			}
		};
	});