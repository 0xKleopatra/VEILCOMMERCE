import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

export var OrderStatus;
(function (OrderStatus) {
  OrderStatus[OrderStatus['Draft'] = 0] = 'Draft';
  OrderStatus[OrderStatus['AwaitingSeller'] = 1] = 'AwaitingSeller';
  OrderStatus[OrderStatus['Confirmed'] = 2] = 'Confirmed';
  OrderStatus[OrderStatus['Funded'] = 3] = 'Funded';
  OrderStatus[OrderStatus['Shipped'] = 4] = 'Shipped';
  OrderStatus[OrderStatus['Delivered'] = 5] = 'Delivered';
  OrderStatus[OrderStatus['Settled'] = 6] = 'Settled';
  OrderStatus[OrderStatus['Cancelled'] = 7] = 'Cancelled';
  OrderStatus[OrderStatus['Disputed'] = 8] = 'Disputed';
})(OrderStatus || (OrderStatus = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = __compactRuntime.CompactTypeBoolean;

const _descriptor_2 = new __compactRuntime.CompactTypeEnum(8, 1);

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

class _OrderRecord_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_0.alignment()))))))))));
  }
  fromValue(value_0) {
    return {
      orderId: _descriptor_0.fromValue(value_0),
      buyerId: _descriptor_0.fromValue(value_0),
      sellerId: _descriptor_0.fromValue(value_0),
      amountCommit: _descriptor_0.fromValue(value_0),
      status: _descriptor_2.fromValue(value_0),
      buyerVerified: _descriptor_1.fromValue(value_0),
      sellerVerified: _descriptor_1.fromValue(value_0),
      fundsVerified: _descriptor_1.fromValue(value_0),
      createdAt: _descriptor_3.fromValue(value_0),
      updatedAt: _descriptor_3.fromValue(value_0),
      termsCommitment: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.orderId).concat(_descriptor_0.toValue(value_0.buyerId).concat(_descriptor_0.toValue(value_0.sellerId).concat(_descriptor_0.toValue(value_0.amountCommit).concat(_descriptor_2.toValue(value_0.status).concat(_descriptor_1.toValue(value_0.buyerVerified).concat(_descriptor_1.toValue(value_0.sellerVerified).concat(_descriptor_1.toValue(value_0.fundsVerified).concat(_descriptor_3.toValue(value_0.createdAt).concat(_descriptor_3.toValue(value_0.updatedAt).concat(_descriptor_0.toValue(value_0.termsCommitment)))))))))));
  }
}

const _descriptor_4 = new _OrderRecord_0();

class _PartySecret_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_5 = new _PartySecret_0();

const _descriptor_6 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _OrderTerms_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment())))));
  }
  fromValue(value_0) {
    return {
      quantity: _descriptor_3.fromValue(value_0),
      unitPrice: _descriptor_3.fromValue(value_0),
      totalAmount: _descriptor_3.fromValue(value_0),
      currency: _descriptor_0.fromValue(value_0),
      destinationHash: _descriptor_0.fromValue(value_0),
      salt: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.quantity).concat(_descriptor_3.toValue(value_0.unitPrice).concat(_descriptor_3.toValue(value_0.totalAmount).concat(_descriptor_0.toValue(value_0.currency).concat(_descriptor_0.toValue(value_0.destinationHash).concat(_descriptor_0.toValue(value_0.salt))))));
  }
}

const _descriptor_7 = new _OrderTerms_0();

const _descriptor_8 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

class _AmountData_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      amount: _descriptor_3.fromValue(value_0),
      salt: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.amount).concat(_descriptor_0.toValue(value_0.salt));
  }
}

const _descriptor_9 = new _AmountData_0();

class _Either_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_1.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_10 = new _Either_0();

const _descriptor_11 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_12 = new _ContractAddress_0();

const _descriptor_13 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.getPartySecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getPartySecret');
    }
    if (typeof(witnesses_0.orderSalt) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named orderSalt');
    }
    if (typeof(witnesses_0.localQuantity) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localQuantity');
    }
    if (typeof(witnesses_0.localUnitPrice) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localUnitPrice');
    }
    if (typeof(witnesses_0.localTotalAmount) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localTotalAmount');
    }
    if (typeof(witnesses_0.localDestinationHash) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localDestinationHash');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      createPurchaseOrder: (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`createPurchaseOrder: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        const sellerId_0 = args_1[2];
        const currency_0 = args_1[3];
        const timestamp_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('createPurchaseOrder',
                                     'argument 1 (as invoked from Typescript)',
                                     'PurchaseOrder.compact line 96 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('createPurchaseOrder',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 96 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        if (!(sellerId_0.buffer instanceof ArrayBuffer && sellerId_0.BYTES_PER_ELEMENT === 1 && sellerId_0.length === 32)) {
          __compactRuntime.typeError('createPurchaseOrder',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 96 char 1',
                                     'Bytes<32>',
                                     sellerId_0)
        }
        if (!(currency_0.buffer instanceof ArrayBuffer && currency_0.BYTES_PER_ELEMENT === 1 && currency_0.length === 32)) {
          __compactRuntime.typeError('createPurchaseOrder',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 96 char 1',
                                     'Bytes<32>',
                                     currency_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('createPurchaseOrder',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 96 char 1',
                                     'Uint<0..18446744073709551616>',
                                     timestamp_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(orderId_0).concat(_descriptor_0.toValue(sellerId_0).concat(_descriptor_0.toValue(currency_0).concat(_descriptor_3.toValue(timestamp_0)))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._createPurchaseOrder_0(context,
                                                     partialProofData,
                                                     orderId_0,
                                                     sellerId_0,
                                                     currency_0,
                                                     timestamp_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      confirmOrder: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`confirmOrder: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        const timestamp_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('confirmOrder',
                                     'argument 1 (as invoked from Typescript)',
                                     'PurchaseOrder.compact line 150 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('confirmOrder',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 150 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('confirmOrder',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 150 char 1',
                                     'Uint<0..18446744073709551616>',
                                     timestamp_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(orderId_0).concat(_descriptor_3.toValue(timestamp_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_3.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._confirmOrder_0(context,
                                              partialProofData,
                                              orderId_0,
                                              timestamp_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      markBuyerVerified: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`markBuyerVerified: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('markBuyerVerified',
                                     'argument 1 (as invoked from Typescript)',
                                     'PurchaseOrder.compact line 180 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('markBuyerVerified',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 180 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(orderId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._markBuyerVerified_0(context,
                                                   partialProofData,
                                                   orderId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      markSellerVerified: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`markSellerVerified: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('markSellerVerified',
                                     'argument 1 (as invoked from Typescript)',
                                     'PurchaseOrder.compact line 200 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('markSellerVerified',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 200 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(orderId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._markSellerVerified_0(context,
                                                    partialProofData,
                                                    orderId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      markFundsVerified: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`markFundsVerified: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('markFundsVerified',
                                     'argument 1 (as invoked from Typescript)',
                                     'PurchaseOrder.compact line 220 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('markFundsVerified',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 220 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(orderId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._markFundsVerified_0(context,
                                                   partialProofData,
                                                   orderId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      markFunded: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`markFunded: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        const timestamp_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('markFunded',
                                     'argument 1 (as invoked from Typescript)',
                                     'PurchaseOrder.compact line 245 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('markFunded',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 245 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('markFunded',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 245 char 1',
                                     'Uint<0..18446744073709551616>',
                                     timestamp_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(orderId_0).concat(_descriptor_3.toValue(timestamp_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_3.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._markFunded_0(context,
                                            partialProofData,
                                            orderId_0,
                                            timestamp_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      markShipped: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`markShipped: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        const timestamp_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('markShipped',
                                     'argument 1 (as invoked from Typescript)',
                                     'PurchaseOrder.compact line 267 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('markShipped',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 267 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('markShipped',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 267 char 1',
                                     'Uint<0..18446744073709551616>',
                                     timestamp_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(orderId_0).concat(_descriptor_3.toValue(timestamp_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_3.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._markShipped_0(context,
                                             partialProofData,
                                             orderId_0,
                                             timestamp_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      markDelivered: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`markDelivered: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        const timestamp_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('markDelivered',
                                     'argument 1 (as invoked from Typescript)',
                                     'PurchaseOrder.compact line 291 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('markDelivered',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 291 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('markDelivered',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 291 char 1',
                                     'Uint<0..18446744073709551616>',
                                     timestamp_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(orderId_0).concat(_descriptor_3.toValue(timestamp_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_3.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._markDelivered_0(context,
                                               partialProofData,
                                               orderId_0,
                                               timestamp_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      markSettled: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`markSettled: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        const timestamp_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('markSettled',
                                     'argument 1 (as invoked from Typescript)',
                                     'PurchaseOrder.compact line 312 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('markSettled',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 312 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('markSettled',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 312 char 1',
                                     'Uint<0..18446744073709551616>',
                                     timestamp_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(orderId_0).concat(_descriptor_3.toValue(timestamp_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_3.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._markSettled_0(context,
                                             partialProofData,
                                             orderId_0,
                                             timestamp_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      cancelOrder: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`cancelOrder: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        const timestamp_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('cancelOrder',
                                     'argument 1 (as invoked from Typescript)',
                                     'PurchaseOrder.compact line 333 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('cancelOrder',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 333 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('cancelOrder',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 333 char 1',
                                     'Uint<0..18446744073709551616>',
                                     timestamp_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(orderId_0).concat(_descriptor_3.toValue(timestamp_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_3.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._cancelOrder_0(context,
                                             partialProofData,
                                             orderId_0,
                                             timestamp_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      getOrder: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`getOrder: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('getOrder',
                                     'argument 1 (as invoked from Typescript)',
                                     'PurchaseOrder.compact line 361 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('getOrder',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 361 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(orderId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._getOrder_0(context, partialProofData, orderId_0);
        partialProofData.output = { value: _descriptor_4.toValue(result_0), alignment: _descriptor_4.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      orderStatus: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`orderStatus: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('orderStatus',
                                     'argument 1 (as invoked from Typescript)',
                                     'PurchaseOrder.compact line 367 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('orderStatus',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'PurchaseOrder.compact line 367 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(orderId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._orderStatus_0(context,
                                             partialProofData,
                                             orderId_0);
        partialProofData.output = { value: _descriptor_2.toValue(result_0), alignment: _descriptor_2.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      createPurchaseOrder: this.circuits.createPurchaseOrder,
      confirmOrder: this.circuits.confirmOrder,
      markBuyerVerified: this.circuits.markBuyerVerified,
      markSellerVerified: this.circuits.markSellerVerified,
      markFundsVerified: this.circuits.markFundsVerified,
      markFunded: this.circuits.markFunded,
      markShipped: this.circuits.markShipped,
      markDelivered: this.circuits.markDelivered,
      markSettled: this.circuits.markSettled,
      cancelOrder: this.circuits.cancelOrder,
      getOrder: this.circuits.getOrder,
      orderStatus: this.circuits.orderStatus
    };
    this.provableCircuits = {
      createPurchaseOrder: this.circuits.createPurchaseOrder,
      confirmOrder: this.circuits.confirmOrder,
      markBuyerVerified: this.circuits.markBuyerVerified,
      markSellerVerified: this.circuits.markSellerVerified,
      markFundsVerified: this.circuits.markFundsVerified,
      markFunded: this.circuits.markFunded,
      markShipped: this.circuits.markShipped,
      markDelivered: this.circuits.markDelivered,
      markSettled: this.circuits.markSettled,
      cancelOrder: this.circuits.cancelOrder,
      getOrder: this.circuits.getOrder,
      orderStatus: this.circuits.orderStatus
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('createPurchaseOrder', new __compactRuntime.ContractOperation());
    state_0.setOperation('confirmOrder', new __compactRuntime.ContractOperation());
    state_0.setOperation('markBuyerVerified', new __compactRuntime.ContractOperation());
    state_0.setOperation('markSellerVerified', new __compactRuntime.ContractOperation());
    state_0.setOperation('markFundsVerified', new __compactRuntime.ContractOperation());
    state_0.setOperation('markFunded', new __compactRuntime.ContractOperation());
    state_0.setOperation('markShipped', new __compactRuntime.ContractOperation());
    state_0.setOperation('markDelivered', new __compactRuntime.ContractOperation());
    state_0.setOperation('markSettled', new __compactRuntime.ContractOperation());
    state_0.setOperation('cancelOrder', new __compactRuntime.ContractOperation());
    state_0.setOperation('getOrder', new __compactRuntime.ContractOperation());
    state_0.setOperation('orderStatus', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(0n),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(1n),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(2n),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(3n),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_7, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_9, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_8, value_0);
    return result_0;
  }
  _getPartySecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getPartySecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && result_0.bytes.buffer instanceof ArrayBuffer && result_0.bytes.BYTES_PER_ELEMENT === 1 && result_0.bytes.length === 32)) {
      __compactRuntime.typeError('getPartySecret',
                                 'return value',
                                 'PurchaseOrder.compact line 57 char 1',
                                 'struct PartySecret<bytes: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_5.toValue(result_0),
      alignment: _descriptor_5.alignment()
    });
    return result_0;
  }
  _orderSalt_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.orderSalt(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('orderSalt',
                                 'return value',
                                 'PurchaseOrder.compact line 58 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _localQuantity_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localQuantity(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('localQuantity',
                                 'return value',
                                 'PurchaseOrder.compact line 59 char 1',
                                 'Uint<0..18446744073709551616>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_3.toValue(result_0),
      alignment: _descriptor_3.alignment()
    });
    return result_0;
  }
  _localUnitPrice_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localUnitPrice(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('localUnitPrice',
                                 'return value',
                                 'PurchaseOrder.compact line 60 char 1',
                                 'Uint<0..18446744073709551616>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_3.toValue(result_0),
      alignment: _descriptor_3.alignment()
    });
    return result_0;
  }
  _localTotalAmount_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localTotalAmount(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('localTotalAmount',
                                 'return value',
                                 'PurchaseOrder.compact line 61 char 1',
                                 'Uint<0..18446744073709551616>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_3.toValue(result_0),
      alignment: _descriptor_3.alignment()
    });
    return result_0;
  }
  _localDestinationHash_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localDestinationHash(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('localDestinationHash',
                                 'return value',
                                 'PurchaseOrder.compact line 62 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _derivePartyId_0(sk_0) {
    return this._persistentHash_2([new Uint8Array([118, 101, 105, 108, 58, 112, 97, 114, 116, 121, 58, 105, 100, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0.bytes]);
  }
  _computeTermsCommitment_0(terms_0) { return this._persistentHash_0(terms_0); }
  _computeAmountCommit_0(amount_0, salt_0) {
    return this._persistentHash_1({ amount: amount_0, salt: salt_0 });
  }
  _computeOrderNullifier_0(sk_0, orderId_0) {
    return this._persistentHash_2([sk_0.bytes, orderId_0]);
  }
  _createPurchaseOrder_0(context,
                         partialProofData,
                         orderId_0,
                         sellerId_0,
                         currency_0,
                         timestamp_0)
  {
    const disclosedId_0 = orderId_0;
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_13.toValue(2n),
                                                                                                                   alignment: _descriptor_13.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Order ID already exists');
    const buyerSecret_0 = this._getPartySecret_0(context, partialProofData);
    const buyerId_0 = this._derivePartyId_0(buyerSecret_0);
    const qty_0 = this._localQuantity_0(context, partialProofData);
    const unitPrice_0 = this._localUnitPrice_0(context, partialProofData);
    const total_0 = this._localTotalAmount_0(context, partialProofData);
    const destHash_0 = this._localDestinationHash_0(context, partialProofData);
    const salt_0 = this._orderSalt_0(context, partialProofData);
    __compactRuntime.assert(this._equal_0(total_0, qty_0 * unitPrice_0),
                            'Amount mismatch: total != qty * unitPrice');
    const terms_0 = { quantity: qty_0,
                      unitPrice: unitPrice_0,
                      totalAmount: total_0,
                      currency: currency_0,
                      destinationHash: destHash_0,
                      salt: salt_0 };
    const termsCommit_0 = this._computeTermsCommitment_0(terms_0);
    const amountCommit_0 = this._computeAmountCommit_0(total_0, salt_0);
    const record_0 = { orderId: orderId_0,
                       buyerId: buyerId_0,
                       sellerId: sellerId_0,
                       amountCommit: amountCommit_0,
                       status: 1,
                       buyerVerified: false,
                       sellerVerified: false,
                       fundsVerified: false,
                       createdAt: timestamp_0,
                       updatedAt: timestamp_0,
                       termsCommitment: termsCommit_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(1n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(record_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(2n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(0n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_6.toValue(tmp_0),
                                                                alignment: _descriptor_6.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _confirmOrder_0(context, partialProofData, orderId_0, timestamp_0) {
    const disclosedId_0 = orderId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(2n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Order not found');
    const rec_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_13.toValue(1n),
                                                                                                        alignment: _descriptor_13.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    __compactRuntime.assert(rec_0.status === 1, 'Not awaiting seller');
    const sellerSecret_0 = this._getPartySecret_0(context, partialProofData);
    const sellerId_0 = this._derivePartyId_0(sellerSecret_0);
    __compactRuntime.assert(this._equal_1(sellerId_0, rec_0.sellerId),
                            'Only designated seller can confirm');
    const updated_0 = { orderId: rec_0.orderId,
                        buyerId: rec_0.buyerId,
                        sellerId: rec_0.sellerId,
                        amountCommit: rec_0.amountCommit,
                        status: 2,
                        buyerVerified: rec_0.buyerVerified,
                        sellerVerified: rec_0.sellerVerified,
                        fundsVerified: rec_0.fundsVerified,
                        createdAt: rec_0.createdAt,
                        updatedAt: timestamp_0,
                        termsCommitment: rec_0.termsCommitment };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(1n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(updated_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _markBuyerVerified_0(context, partialProofData, orderId_0) {
    const disclosedId_0 = orderId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(2n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Order not found');
    const rec_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_13.toValue(1n),
                                                                                                        alignment: _descriptor_13.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    const updated_0 = { orderId: rec_0.orderId,
                        buyerId: rec_0.buyerId,
                        sellerId: rec_0.sellerId,
                        amountCommit: rec_0.amountCommit,
                        status: rec_0.status,
                        buyerVerified: true,
                        sellerVerified: rec_0.sellerVerified,
                        fundsVerified: rec_0.fundsVerified,
                        createdAt: rec_0.createdAt,
                        updatedAt: rec_0.updatedAt,
                        termsCommitment: rec_0.termsCommitment };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(1n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(updated_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _markSellerVerified_0(context, partialProofData, orderId_0) {
    const disclosedId_0 = orderId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(2n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Order not found');
    const rec_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_13.toValue(1n),
                                                                                                        alignment: _descriptor_13.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    const updated_0 = { orderId: rec_0.orderId,
                        buyerId: rec_0.buyerId,
                        sellerId: rec_0.sellerId,
                        amountCommit: rec_0.amountCommit,
                        status: rec_0.status,
                        buyerVerified: rec_0.buyerVerified,
                        sellerVerified: true,
                        fundsVerified: rec_0.fundsVerified,
                        createdAt: rec_0.createdAt,
                        updatedAt: rec_0.updatedAt,
                        termsCommitment: rec_0.termsCommitment };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(1n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(updated_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _markFundsVerified_0(context, partialProofData, orderId_0) {
    const disclosedId_0 = orderId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(2n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Order not found');
    const rec_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_13.toValue(1n),
                                                                                                        alignment: _descriptor_13.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    __compactRuntime.assert(rec_0.buyerVerified, 'Buyer must be verified first');
    const updated_0 = { orderId: rec_0.orderId,
                        buyerId: rec_0.buyerId,
                        sellerId: rec_0.sellerId,
                        amountCommit: rec_0.amountCommit,
                        status: rec_0.status,
                        buyerVerified: rec_0.buyerVerified,
                        sellerVerified: rec_0.sellerVerified,
                        fundsVerified: true,
                        createdAt: rec_0.createdAt,
                        updatedAt: rec_0.updatedAt,
                        termsCommitment: rec_0.termsCommitment };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(1n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(updated_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _markFunded_0(context, partialProofData, orderId_0, timestamp_0) {
    const disclosedId_0 = orderId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(2n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Order not found');
    const rec_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_13.toValue(1n),
                                                                                                        alignment: _descriptor_13.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    __compactRuntime.assert(rec_0.status === 2, 'Must be confirmed');
    __compactRuntime.assert(rec_0.buyerVerified && rec_0.sellerVerified
                            &&
                            rec_0.fundsVerified,
                            'Verification incomplete');
    const updated_0 = { orderId: rec_0.orderId,
                        buyerId: rec_0.buyerId,
                        sellerId: rec_0.sellerId,
                        amountCommit: rec_0.amountCommit,
                        status: 3,
                        buyerVerified: rec_0.buyerVerified,
                        sellerVerified: rec_0.sellerVerified,
                        fundsVerified: rec_0.fundsVerified,
                        createdAt: rec_0.createdAt,
                        updatedAt: timestamp_0,
                        termsCommitment: rec_0.termsCommitment };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(1n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(updated_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _markShipped_0(context, partialProofData, orderId_0, timestamp_0) {
    const disclosedId_0 = orderId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(2n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Order not found');
    const rec_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_13.toValue(1n),
                                                                                                        alignment: _descriptor_13.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    __compactRuntime.assert(rec_0.status === 3, 'Must be funded');
    const sk_0 = this._getPartySecret_0(context, partialProofData);
    const sellerId_0 = this._derivePartyId_0(sk_0);
    __compactRuntime.assert(this._equal_2(sellerId_0, rec_0.sellerId),
                            'Only seller can mark shipped');
    const updated_0 = { orderId: rec_0.orderId,
                        buyerId: rec_0.buyerId,
                        sellerId: rec_0.sellerId,
                        amountCommit: rec_0.amountCommit,
                        status: 4,
                        buyerVerified: rec_0.buyerVerified,
                        sellerVerified: rec_0.sellerVerified,
                        fundsVerified: rec_0.fundsVerified,
                        createdAt: rec_0.createdAt,
                        updatedAt: timestamp_0,
                        termsCommitment: rec_0.termsCommitment };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(1n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(updated_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _markDelivered_0(context, partialProofData, orderId_0, timestamp_0) {
    const disclosedId_0 = orderId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(2n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Order not found');
    const rec_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_13.toValue(1n),
                                                                                                        alignment: _descriptor_13.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    __compactRuntime.assert(rec_0.status === 4, 'Must be shipped');
    const updated_0 = { orderId: rec_0.orderId,
                        buyerId: rec_0.buyerId,
                        sellerId: rec_0.sellerId,
                        amountCommit: rec_0.amountCommit,
                        status: 5,
                        buyerVerified: rec_0.buyerVerified,
                        sellerVerified: rec_0.sellerVerified,
                        fundsVerified: rec_0.fundsVerified,
                        createdAt: rec_0.createdAt,
                        updatedAt: timestamp_0,
                        termsCommitment: rec_0.termsCommitment };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(1n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(updated_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _markSettled_0(context, partialProofData, orderId_0, timestamp_0) {
    const disclosedId_0 = orderId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(2n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Order not found');
    const rec_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_13.toValue(1n),
                                                                                                        alignment: _descriptor_13.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    __compactRuntime.assert(rec_0.status === 5, 'Must be delivered');
    const updated_0 = { orderId: rec_0.orderId,
                        buyerId: rec_0.buyerId,
                        sellerId: rec_0.sellerId,
                        amountCommit: rec_0.amountCommit,
                        status: 6,
                        buyerVerified: rec_0.buyerVerified,
                        sellerVerified: rec_0.sellerVerified,
                        fundsVerified: rec_0.fundsVerified,
                        createdAt: rec_0.createdAt,
                        updatedAt: timestamp_0,
                        termsCommitment: rec_0.termsCommitment };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(1n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(updated_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _cancelOrder_0(context, partialProofData, orderId_0, timestamp_0) {
    const disclosedId_0 = orderId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(2n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Order not found');
    const rec_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_13.toValue(1n),
                                                                                                        alignment: _descriptor_13.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    __compactRuntime.assert(rec_0.status === 0 || rec_0.status === 1
                            ||
                            rec_0.status === 2,
                            'Cannot cancel in current state');
    const sk_0 = this._getPartySecret_0(context, partialProofData);
    const callerId_0 = this._derivePartyId_0(sk_0);
    __compactRuntime.assert(this._equal_3(callerId_0, rec_0.buyerId)
                            ||
                            this._equal_4(callerId_0, rec_0.sellerId),
                            'Only party can cancel');
    const nullifier_0 = this._computeOrderNullifier_0(sk_0, orderId_0);
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_13.toValue(3n),
                                                                                                                   alignment: _descriptor_13.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Replay');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(3n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const updated_0 = { orderId: rec_0.orderId,
                        buyerId: rec_0.buyerId,
                        sellerId: rec_0.sellerId,
                        amountCommit: rec_0.amountCommit,
                        status: 7,
                        buyerVerified: rec_0.buyerVerified,
                        sellerVerified: rec_0.sellerVerified,
                        fundsVerified: rec_0.fundsVerified,
                        createdAt: rec_0.createdAt,
                        updatedAt: timestamp_0,
                        termsCommitment: rec_0.termsCommitment };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(1n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(updated_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _getOrder_0(context, partialProofData, orderId_0) {
    const disclosedId_0 = orderId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(2n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Order not found');
    return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_13.toValue(1n),
                                                                                                 alignment: _descriptor_13.alignment() } }] } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                 alignment: _descriptor_0.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value);
  }
  _orderStatus_0(context, partialProofData, orderId_0) {
    const disclosedId_0 = orderId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(2n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Order not found');
    return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_13.toValue(1n),
                                                                                                 alignment: _descriptor_13.alignment() } }] } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                 alignment: _descriptor_0.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value).status;
  }
  _equal_0(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get totalOrders() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_13.toValue(0n),
                                                                                                   alignment: _descriptor_13.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    orders: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(1n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(1n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'PurchaseOrder.compact line 52 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(1n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'PurchaseOrder.compact line 52 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(1n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_4.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    orderExists: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(2n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(2n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'PurchaseOrder.compact line 53 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(2n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    usedOrderNullifiers: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(3n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(3n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'PurchaseOrder.compact line 54 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(3n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[3];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  getPartySecret: (...args) => undefined,
  orderSalt: (...args) => undefined,
  localQuantity: (...args) => undefined,
  localUnitPrice: (...args) => undefined,
  localTotalAmount: (...args) => undefined,
  localDestinationHash: (...args) => undefined
});
export const pureCircuits = {};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
