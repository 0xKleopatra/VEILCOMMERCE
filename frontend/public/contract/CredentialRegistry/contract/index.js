import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

export var CredentialType;
(function (CredentialType) {
  CredentialType[CredentialType['BusinessRegistration'] = 0] = 'BusinessRegistration';
  CredentialType[CredentialType['TaxId'] = 1] = 'TaxId';
  CredentialType[CredentialType['TradeLicense'] = 2] = 'TradeLicense';
  CredentialType[CredentialType['BankStatement'] = 3] = 'BankStatement';
  CredentialType[CredentialType['ComplianceCert'] = 4] = 'ComplianceCert';
  CredentialType[CredentialType['Other'] = 5] = 'Other';
})(CredentialType || (CredentialType = {}));

export var CredentialStatus;
(function (CredentialStatus) {
  CredentialStatus[CredentialStatus['Active'] = 0] = 'Active';
  CredentialStatus[CredentialStatus['Revoked'] = 1] = 'Revoked';
  CredentialStatus[CredentialStatus['Expired'] = 2] = 'Expired';
  CredentialStatus[CredentialStatus['Suspended'] = 3] = 'Suspended';
})(CredentialStatus || (CredentialStatus = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = __compactRuntime.CompactTypeBoolean;

const _descriptor_2 = new __compactRuntime.CompactTypeEnum(5, 1);

const _descriptor_3 = new __compactRuntime.CompactTypeEnum(3, 1);

const _descriptor_4 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

class _CredentialRecord_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_4.alignment().concat(_descriptor_4.alignment())))))));
  }
  fromValue(value_0) {
    return {
      credentialId: _descriptor_0.fromValue(value_0),
      holderId: _descriptor_0.fromValue(value_0),
      issuerId: _descriptor_0.fromValue(value_0),
      credentialType: _descriptor_2.fromValue(value_0),
      commitment: _descriptor_0.fromValue(value_0),
      status: _descriptor_3.fromValue(value_0),
      issuedAt: _descriptor_4.fromValue(value_0),
      expiresAt: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.credentialId).concat(_descriptor_0.toValue(value_0.holderId).concat(_descriptor_0.toValue(value_0.issuerId).concat(_descriptor_2.toValue(value_0.credentialType).concat(_descriptor_0.toValue(value_0.commitment).concat(_descriptor_3.toValue(value_0.status).concat(_descriptor_4.toValue(value_0.issuedAt).concat(_descriptor_4.toValue(value_0.expiresAt))))))));
  }
}

const _descriptor_5 = new _CredentialRecord_0();

const _descriptor_6 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _CredentialPreimage_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_4.alignment().concat(_descriptor_0.alignment())));
  }
  fromValue(value_0) {
    return {
      holderSecret: _descriptor_0.fromValue(value_0),
      credentialType: _descriptor_2.fromValue(value_0),
      issuedAt: _descriptor_4.fromValue(value_0),
      salt: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.holderSecret).concat(_descriptor_2.toValue(value_0.credentialType).concat(_descriptor_4.toValue(value_0.issuedAt).concat(_descriptor_0.toValue(value_0.salt))));
  }
}

const _descriptor_7 = new _CredentialPreimage_0();

class _HolderSecret_0 {
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

const _descriptor_8 = new _HolderSecret_0();

const _descriptor_9 = new __compactRuntime.CompactTypeVector(3, _descriptor_0);

const _descriptor_10 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

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

const _descriptor_11 = new _Either_0();

const _descriptor_12 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

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

const _descriptor_13 = new _ContractAddress_0();

const _descriptor_14 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

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
    if (typeof(witnesses_0.getHolderSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getHolderSecret');
    }
    if (typeof(witnesses_0.getIssuerSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getIssuerSecret');
    }
    if (typeof(witnesses_0.credentialSalt) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named credentialSalt');
    }
    if (typeof(witnesses_0.credentialIssuedAt) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named credentialIssuedAt');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      addTrustedIssuer: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`addTrustedIssuer: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const issuerId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('addTrustedIssuer',
                                     'argument 1 (as invoked from Typescript)',
                                     'CredentialRegistry.compact line 99 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(issuerId_0.buffer instanceof ArrayBuffer && issuerId_0.BYTES_PER_ELEMENT === 1 && issuerId_0.length === 32)) {
          __compactRuntime.typeError('addTrustedIssuer',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 99 char 1',
                                     'Bytes<32>',
                                     issuerId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(issuerId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._addTrustedIssuer_0(context,
                                                  partialProofData,
                                                  issuerId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      issueCredential: (...args_1) => {
        if (args_1.length !== 6) {
          throw new __compactRuntime.CompactError(`issueCredential: expected 6 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const credentialId_0 = args_1[1];
        const holderId_0 = args_1[2];
        const credentialType_0 = args_1[3];
        const expiresAt_0 = args_1[4];
        const timestamp_0 = args_1[5];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('issueCredential',
                                     'argument 1 (as invoked from Typescript)',
                                     'CredentialRegistry.compact line 106 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(credentialId_0.buffer instanceof ArrayBuffer && credentialId_0.BYTES_PER_ELEMENT === 1 && credentialId_0.length === 32)) {
          __compactRuntime.typeError('issueCredential',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 106 char 1',
                                     'Bytes<32>',
                                     credentialId_0)
        }
        if (!(holderId_0.buffer instanceof ArrayBuffer && holderId_0.BYTES_PER_ELEMENT === 1 && holderId_0.length === 32)) {
          __compactRuntime.typeError('issueCredential',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 106 char 1',
                                     'Bytes<32>',
                                     holderId_0)
        }
        if (!(typeof(credentialType_0) === 'number' && credentialType_0 >= 0 && credentialType_0 <= 5)) {
          __compactRuntime.typeError('issueCredential',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 106 char 1',
                                     'Enum<CredentialType, BusinessRegistration, TaxId, TradeLicense, BankStatement, ComplianceCert, Other>',
                                     credentialType_0)
        }
        if (!(typeof(expiresAt_0) === 'bigint' && expiresAt_0 >= 0n && expiresAt_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('issueCredential',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 106 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expiresAt_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('issueCredential',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 106 char 1',
                                     'Uint<0..18446744073709551616>',
                                     timestamp_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(credentialId_0).concat(_descriptor_0.toValue(holderId_0).concat(_descriptor_2.toValue(credentialType_0).concat(_descriptor_4.toValue(expiresAt_0).concat(_descriptor_4.toValue(timestamp_0))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_4.alignment().concat(_descriptor_4.alignment()))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._issueCredential_0(context,
                                                 partialProofData,
                                                 credentialId_0,
                                                 holderId_0,
                                                 credentialType_0,
                                                 expiresAt_0,
                                                 timestamp_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      proveCredential: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`proveCredential: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const credentialId_0 = args_1[1];
        const verifierId_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('proveCredential',
                                     'argument 1 (as invoked from Typescript)',
                                     'CredentialRegistry.compact line 147 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(credentialId_0.buffer instanceof ArrayBuffer && credentialId_0.BYTES_PER_ELEMENT === 1 && credentialId_0.length === 32)) {
          __compactRuntime.typeError('proveCredential',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 147 char 1',
                                     'Bytes<32>',
                                     credentialId_0)
        }
        if (!(verifierId_0.buffer instanceof ArrayBuffer && verifierId_0.BYTES_PER_ELEMENT === 1 && verifierId_0.length === 32)) {
          __compactRuntime.typeError('proveCredential',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 147 char 1',
                                     'Bytes<32>',
                                     verifierId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(credentialId_0).concat(_descriptor_0.toValue(verifierId_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._proveCredential_0(context,
                                                 partialProofData,
                                                 credentialId_0,
                                                 verifierId_0);
        partialProofData.output = { value: _descriptor_1.toValue(result_0), alignment: _descriptor_1.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      verifyCredential: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`verifyCredential: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const credentialId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('verifyCredential',
                                     'argument 1 (as invoked from Typescript)',
                                     'CredentialRegistry.compact line 181 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(credentialId_0.buffer instanceof ArrayBuffer && credentialId_0.BYTES_PER_ELEMENT === 1 && credentialId_0.length === 32)) {
          __compactRuntime.typeError('verifyCredential',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 181 char 1',
                                     'Bytes<32>',
                                     credentialId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(credentialId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._verifyCredential_0(context,
                                                  partialProofData,
                                                  credentialId_0);
        partialProofData.output = { value: _descriptor_1.toValue(result_0), alignment: _descriptor_1.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      revokeCredential: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`revokeCredential: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const credentialId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('revokeCredential',
                                     'argument 1 (as invoked from Typescript)',
                                     'CredentialRegistry.compact line 191 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(credentialId_0.buffer instanceof ArrayBuffer && credentialId_0.BYTES_PER_ELEMENT === 1 && credentialId_0.length === 32)) {
          __compactRuntime.typeError('revokeCredential',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 191 char 1',
                                     'Bytes<32>',
                                     credentialId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(credentialId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._revokeCredential_0(context,
                                                  partialProofData,
                                                  credentialId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      suspendCredential: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`suspendCredential: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const credentialId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('suspendCredential',
                                     'argument 1 (as invoked from Typescript)',
                                     'CredentialRegistry.compact line 203 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(credentialId_0.buffer instanceof ArrayBuffer && credentialId_0.BYTES_PER_ELEMENT === 1 && credentialId_0.length === 32)) {
          __compactRuntime.typeError('suspendCredential',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 203 char 1',
                                     'Bytes<32>',
                                     credentialId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(credentialId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._suspendCredential_0(context,
                                                   partialProofData,
                                                   credentialId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      getCredential: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`getCredential: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const credentialId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('getCredential',
                                     'argument 1 (as invoked from Typescript)',
                                     'CredentialRegistry.compact line 226 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(credentialId_0.buffer instanceof ArrayBuffer && credentialId_0.BYTES_PER_ELEMENT === 1 && credentialId_0.length === 32)) {
          __compactRuntime.typeError('getCredential',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 226 char 1',
                                     'Bytes<32>',
                                     credentialId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(credentialId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._getCredential_0(context,
                                               partialProofData,
                                               credentialId_0);
        partialProofData.output = { value: _descriptor_5.toValue(result_0), alignment: _descriptor_5.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      isRevoked: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`isRevoked: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const credentialId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('isRevoked',
                                     'argument 1 (as invoked from Typescript)',
                                     'CredentialRegistry.compact line 232 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(credentialId_0.buffer instanceof ArrayBuffer && credentialId_0.BYTES_PER_ELEMENT === 1 && credentialId_0.length === 32)) {
          __compactRuntime.typeError('isRevoked',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 232 char 1',
                                     'Bytes<32>',
                                     credentialId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(credentialId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._isRevoked_0(context,
                                           partialProofData,
                                           credentialId_0);
        partialProofData.output = { value: _descriptor_1.toValue(result_0), alignment: _descriptor_1.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      commitmentOf: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`commitmentOf: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const credentialId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('commitmentOf',
                                     'argument 1 (as invoked from Typescript)',
                                     'CredentialRegistry.compact line 236 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(credentialId_0.buffer instanceof ArrayBuffer && credentialId_0.BYTES_PER_ELEMENT === 1 && credentialId_0.length === 32)) {
          __compactRuntime.typeError('commitmentOf',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'CredentialRegistry.compact line 236 char 1',
                                     'Bytes<32>',
                                     credentialId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(credentialId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._commitmentOf_0(context,
                                              partialProofData,
                                              credentialId_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      addTrustedIssuer: this.circuits.addTrustedIssuer,
      issueCredential: this.circuits.issueCredential,
      proveCredential: this.circuits.proveCredential,
      verifyCredential: this.circuits.verifyCredential,
      revokeCredential: this.circuits.revokeCredential,
      suspendCredential: this.circuits.suspendCredential,
      getCredential: this.circuits.getCredential,
      isRevoked: this.circuits.isRevoked,
      commitmentOf: this.circuits.commitmentOf
    };
    this.provableCircuits = {
      addTrustedIssuer: this.circuits.addTrustedIssuer,
      issueCredential: this.circuits.issueCredential,
      proveCredential: this.circuits.proveCredential,
      verifyCredential: this.circuits.verifyCredential,
      revokeCredential: this.circuits.revokeCredential,
      suspendCredential: this.circuits.suspendCredential,
      getCredential: this.circuits.getCredential,
      isRevoked: this.circuits.isRevoked,
      commitmentOf: this.circuits.commitmentOf
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
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('addTrustedIssuer', new __compactRuntime.ContractOperation());
    state_0.setOperation('issueCredential', new __compactRuntime.ContractOperation());
    state_0.setOperation('proveCredential', new __compactRuntime.ContractOperation());
    state_0.setOperation('verifyCredential', new __compactRuntime.ContractOperation());
    state_0.setOperation('revokeCredential', new __compactRuntime.ContractOperation());
    state_0.setOperation('suspendCredential', new __compactRuntime.ContractOperation());
    state_0.setOperation('getCredential', new __compactRuntime.ContractOperation());
    state_0.setOperation('isRevoked', new __compactRuntime.ContractOperation());
    state_0.setOperation('commitmentOf', new __compactRuntime.ContractOperation());
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
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(0n),
                                                                                              alignment: _descriptor_14.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(1n),
                                                                                              alignment: _descriptor_14.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(2n),
                                                                                              alignment: _descriptor_14.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(3n),
                                                                                              alignment: _descriptor_14.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(4n),
                                                                                              alignment: _descriptor_14.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(5n),
                                                                                              alignment: _descriptor_14.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(6n),
                                                                                              alignment: _descriptor_14.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(7n),
                                                                                              alignment: _descriptor_14.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const adminSecret_0 = this._getIssuerSecret_0(context, partialProofData);
    const tmp_0 = this._deriveIssuerId_0(adminSecret_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(7n),
                                                                                              alignment: _descriptor_14.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_1 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_14.toValue(7n),
                                                                                                        alignment: _descriptor_14.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_14.toValue(6n),
                                                                  alignment: _descriptor_14.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
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
    const result_0 = __compactRuntime.persistentHash(_descriptor_10, value_0);
    return result_0;
  }
  _getHolderSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getHolderSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && result_0.bytes.buffer instanceof ArrayBuffer && result_0.bytes.BYTES_PER_ELEMENT === 1 && result_0.bytes.length === 32)) {
      __compactRuntime.typeError('getHolderSecret',
                                 'return value',
                                 'CredentialRegistry.compact line 60 char 1',
                                 'struct HolderSecret<bytes: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_8.toValue(result_0),
      alignment: _descriptor_8.alignment()
    });
    return result_0;
  }
  _getIssuerSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getIssuerSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && result_0.bytes.buffer instanceof ArrayBuffer && result_0.bytes.BYTES_PER_ELEMENT === 1 && result_0.bytes.length === 32)) {
      __compactRuntime.typeError('getIssuerSecret',
                                 'return value',
                                 'CredentialRegistry.compact line 61 char 1',
                                 'struct HolderSecret<bytes: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_8.toValue(result_0),
      alignment: _descriptor_8.alignment()
    });
    return result_0;
  }
  _credentialSalt_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.credentialSalt(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('credentialSalt',
                                 'return value',
                                 'CredentialRegistry.compact line 62 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _credentialIssuedAt_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.credentialIssuedAt(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('credentialIssuedAt',
                                 'return value',
                                 'CredentialRegistry.compact line 63 char 1',
                                 'Uint<0..18446744073709551616>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_4.toValue(result_0),
      alignment: _descriptor_4.alignment()
    });
    return result_0;
  }
  _deriveHolderId_0(sk_0) {
    return this._persistentHash_2([new Uint8Array([118, 101, 105, 108, 58, 99, 114, 101, 100, 58, 104, 111, 108, 100, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0.bytes]);
  }
  _deriveIssuerId_0(sk_0) {
    return this._persistentHash_2([new Uint8Array([118, 101, 105, 108, 58, 99, 114, 101, 100, 58, 105, 115, 115, 117, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0.bytes]);
  }
  _computeCredentialCommitment_0(preimage_0) {
    return this._persistentHash_0(preimage_0);
  }
  _computePresentationNullifier_0(sk_0, credentialId_0, verifierId_0) {
    return this._persistentHash_1([sk_0.bytes, credentialId_0, verifierId_0]);
  }
  _addTrustedIssuer_0(context, partialProofData, issuerId_0) {
    const adminSecret_0 = this._getIssuerSecret_0(context, partialProofData);
    __compactRuntime.assert(this._equal_0(this._deriveIssuerId_0(adminSecret_0),
                                          _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_14.toValue(7n),
                                                                                                                                alignment: _descriptor_14.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'Only admin');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_14.toValue(6n),
                                                                  alignment: _descriptor_14.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(issuerId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _issueCredential_0(context,
                     partialProofData,
                     credentialId_0,
                     holderId_0,
                     credentialType_0,
                     expiresAt_0,
                     timestamp_0)
  {
    const disclosedId_0 = credentialId_0;
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_14.toValue(2n),
                                                                                                                   alignment: _descriptor_14.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Credential already exists');
    const issuerSecret_0 = this._getIssuerSecret_0(context, partialProofData);
    const issuerId_0 = this._deriveIssuerId_0(issuerSecret_0);
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_14.toValue(6n),
                                                                                                                  alignment: _descriptor_14.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(issuerId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Issuer not trusted');
    const salt_0 = this._credentialSalt_0(context, partialProofData);
    const issuedAt_0 = this._credentialIssuedAt_0(context, partialProofData);
    const preimage_0 = { holderSecret: holderId_0,
                         credentialType: credentialType_0,
                         issuedAt: issuedAt_0,
                         salt: salt_0 };
    const commitment_0 = this._computeCredentialCommitment_0(preimage_0);
    const record_0 = { credentialId: credentialId_0,
                       holderId: holderId_0,
                       issuerId: issuerId_0,
                       credentialType: credentialType_0,
                       commitment: commitment_0,
                       status: 0,
                       issuedAt: timestamp_0,
                       expiresAt: expiresAt_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_14.toValue(1n),
                                                                  alignment: _descriptor_14.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(record_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_14.toValue(2n),
                                                                  alignment: _descriptor_14.alignment() } }] } },
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
                                                         value: { value: _descriptor_14.toValue(0n),
                                                                  alignment: _descriptor_14.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_6.toValue(tmp_0),
                                                                alignment: _descriptor_6.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _proveCredential_0(context, partialProofData, credentialId_0, verifierId_0) {
    const disclosedId_0 = credentialId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_14.toValue(2n),
                                                                                                                  alignment: _descriptor_14.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Credential not found');
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_14.toValue(3n),
                                                                                                                   alignment: _descriptor_14.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Credential revoked');
    const rec_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_14.toValue(1n),
                                                                                                        alignment: _descriptor_14.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    __compactRuntime.assert(rec_0.status === 0, 'Not active');
    const holderSecret_0 = this._getHolderSecret_0(context, partialProofData);
    const holderId_0 = this._deriveHolderId_0(holderSecret_0);
    __compactRuntime.assert(this._equal_1(holderId_0, rec_0.holderId),
                            'Not holder');
    const salt_0 = this._credentialSalt_0(context, partialProofData);
    const issuedAt_0 = this._credentialIssuedAt_0(context, partialProofData);
    const preimage_0 = { holderSecret: holderId_0,
                         credentialType: rec_0.credentialType,
                         issuedAt: issuedAt_0,
                         salt: salt_0 };
    const recomputed_0 = this._computeCredentialCommitment_0(preimage_0);
    __compactRuntime.assert(this._equal_2(recomputed_0, rec_0.commitment),
                            'Credential proof failed');
    const nullifier_0 = this._computePresentationNullifier_0(holderSecret_0,
                                                             credentialId_0,
                                                             verifierId_0);
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_14.toValue(5n),
                                                                                                                   alignment: _descriptor_14.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Presentation already used');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_14.toValue(5n),
                                                                  alignment: _descriptor_14.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return true;
  }
  _verifyCredential_0(context, partialProofData, credentialId_0) {
    const disclosedId_0 = credentialId_0;
    if (!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                   partialProofData,
                                                                   [
                                                                    { dup: { n: 0 } },
                                                                    { idx: { cached: false,
                                                                             pushPath: false,
                                                                             path: [
                                                                                    { tag: 'value',
                                                                                      value: { value: _descriptor_14.toValue(2n),
                                                                                               alignment: _descriptor_14.alignment() } }] } },
                                                                    { push: { storage: false,
                                                                              value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                           alignment: _descriptor_0.alignment() }).encode() } },
                                                                    'member',
                                                                    { popeq: { cached: true,
                                                                               result: undefined } }]).value))
    {
      return false;
    } else {
      if (_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_14.toValue(3n),
                                                                                                alignment: _descriptor_14.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value))
      {
        return false;
      } else {
        const rec_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_14.toValue(1n),
                                                                                                            alignment: _descriptor_14.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
        return rec_0.status === 0;
      }
    }
  }
  _revokeCredential_0(context, partialProofData, credentialId_0) {
    const issuerSecret_0 = this._getIssuerSecret_0(context, partialProofData);
    const issuerId_0 = this._deriveIssuerId_0(issuerSecret_0);
    const disclosedId_0 = credentialId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_14.toValue(2n),
                                                                                                                  alignment: _descriptor_14.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Credential not found');
    const rec_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_14.toValue(1n),
                                                                                                        alignment: _descriptor_14.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    const isIssuer_0 = this._equal_3(issuerId_0, rec_0.issuerId);
    const isAdmin_0 = this._equal_4(issuerId_0,
                                    _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                              partialProofData,
                                                                                              [
                                                                                               { dup: { n: 0 } },
                                                                                               { idx: { cached: false,
                                                                                                        pushPath: false,
                                                                                                        path: [
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_14.toValue(7n),
                                                                                                                          alignment: _descriptor_14.alignment() } }] } },
                                                                                               { popeq: { cached: false,
                                                                                                          result: undefined } }]).value));
    __compactRuntime.assert(isIssuer_0 || isAdmin_0, 'Only issuer or admin');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_14.toValue(3n),
                                                                  alignment: _descriptor_14.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _suspendCredential_0(context, partialProofData, credentialId_0) {
    const issuerSecret_0 = this._getIssuerSecret_0(context, partialProofData);
    const issuerId_0 = this._deriveIssuerId_0(issuerSecret_0);
    const disclosedId_0 = credentialId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_14.toValue(2n),
                                                                                                                  alignment: _descriptor_14.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Credential not found');
    const rec_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_14.toValue(1n),
                                                                                                        alignment: _descriptor_14.alignment() } }] } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                        alignment: _descriptor_0.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    const isIssuer_0 = this._equal_5(issuerId_0, rec_0.issuerId);
    const isAdmin_0 = this._equal_6(issuerId_0,
                                    _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                              partialProofData,
                                                                                              [
                                                                                               { dup: { n: 0 } },
                                                                                               { idx: { cached: false,
                                                                                                        pushPath: false,
                                                                                                        path: [
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_14.toValue(7n),
                                                                                                                          alignment: _descriptor_14.alignment() } }] } },
                                                                                               { popeq: { cached: false,
                                                                                                          result: undefined } }]).value));
    __compactRuntime.assert(isIssuer_0 || isAdmin_0, 'Only issuer or admin');
    const updated_0 = { credentialId: rec_0.credentialId,
                        holderId: rec_0.holderId,
                        issuerId: rec_0.issuerId,
                        credentialType: rec_0.credentialType,
                        commitment: rec_0.commitment,
                        status: 3,
                        issuedAt: rec_0.issuedAt,
                        expiresAt: rec_0.expiresAt };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_14.toValue(1n),
                                                                  alignment: _descriptor_14.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(updated_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _getCredential_0(context, partialProofData, credentialId_0) {
    const disclosedId_0 = credentialId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_14.toValue(2n),
                                                                                                                  alignment: _descriptor_14.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Credential not found');
    return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_14.toValue(1n),
                                                                                                 alignment: _descriptor_14.alignment() } }] } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                 alignment: _descriptor_0.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value);
  }
  _isRevoked_0(context, partialProofData, credentialId_0) {
    return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_14.toValue(3n),
                                                                                                 alignment: _descriptor_14.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(credentialId_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  _commitmentOf_0(context, partialProofData, credentialId_0) {
    const disclosedId_0 = credentialId_0;
    __compactRuntime.assert(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_14.toValue(2n),
                                                                                                                  alignment: _descriptor_14.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(disclosedId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Credential not found');
    return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_14.toValue(1n),
                                                                                                 alignment: _descriptor_14.alignment() } }] } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_0.toValue(disclosedId_0),
                                                                                                 alignment: _descriptor_0.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value).commitment;
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
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
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
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
    get totalCredentials() {
      return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_14.toValue(0n),
                                                                                                   alignment: _descriptor_14.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    credentials: {
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
                                                                                            value: { value: _descriptor_14.toValue(1n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_14.toValue(1n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
                                     'CredentialRegistry.compact line 49 char 1',
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
                                                                                            value: { value: _descriptor_14.toValue(1n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
                                     'CredentialRegistry.compact line 49 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_14.toValue(1n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_5.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    credentialExists: {
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
                                                                                            value: { value: _descriptor_14.toValue(2n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_14.toValue(2n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
                                     'CredentialRegistry.compact line 50 char 1',
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
                                                                                            value: { value: _descriptor_14.toValue(2n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
    revokedCredentials: {
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
                                                                                            value: { value: _descriptor_14.toValue(3n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_14.toValue(3n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
                                     'CredentialRegistry.compact line 51 char 1',
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
                                                                                            value: { value: _descriptor_14.toValue(3n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
    },
    holderCredentials: {
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
                                                                                            value: { value: _descriptor_14.toValue(4n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_14.toValue(4n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
                                     'CredentialRegistry.compact line 52 char 1',
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
                                                                                            value: { value: _descriptor_14.toValue(4n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
                                     'CredentialRegistry.compact line 52 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        if (state.asArray()[4].asMap().get({ value: _descriptor_0.toValue(key_0),
                                             alignment: _descriptor_0.alignment() }) === undefined) {
          throw new __compactRuntime.CompactError(`Map value undefined for ${key_0}`);
        }
        return {
          isEmpty(...args_1) {
            if (args_1.length !== 0) {
              throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_1.length}`);
            }
            return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_14.toValue(4n),
                                                                                                         alignment: _descriptor_14.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_0.toValue(key_0),
                                                                                                         alignment: _descriptor_0.alignment() } }] } },
                                                                              'size',
                                                                              { push: { storage: false,
                                                                                        value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                     alignment: _descriptor_4.alignment() }).encode() } },
                                                                              'eq',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          },
          size(...args_1) {
            if (args_1.length !== 0) {
              throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_1.length}`);
            }
            return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_14.toValue(4n),
                                                                                                         alignment: _descriptor_14.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_0.toValue(key_0),
                                                                                                         alignment: _descriptor_0.alignment() } }] } },
                                                                              'size',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          },
          member(...args_1) {
            if (args_1.length !== 1) {
              throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_1.length}`);
            }
            const elem_0 = args_1[0];
            if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
              __compactRuntime.typeError('member',
                                         'argument 1',
                                         'CredentialRegistry.compact line 52 char 49',
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
                                                                                                value: { value: _descriptor_14.toValue(4n),
                                                                                                         alignment: _descriptor_14.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_0.toValue(key_0),
                                                                                                         alignment: _descriptor_0.alignment() } }] } },
                                                                              { push: { storage: false,
                                                                                        value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                     alignment: _descriptor_0.alignment() }).encode() } },
                                                                              'member',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value);
          },
          [Symbol.iterator](...args_1) {
            if (args_1.length !== 0) {
              throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_1.length}`);
            }
            const self_0 = state.asArray()[4].asMap().get({ value: _descriptor_0.toValue(key_0),
                                                            alignment: _descriptor_0.alignment() });
            return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
          }
        }
      }
    },
    usedCredentialNullifiers: {
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
                                                                                            value: { value: _descriptor_14.toValue(5n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_14.toValue(5n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
                                     'CredentialRegistry.compact line 53 char 1',
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
                                                                                            value: { value: _descriptor_14.toValue(5n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
        const self_0 = state.asArray()[5];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    trustedIssuers: {
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
                                                                                            value: { value: _descriptor_14.toValue(6n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_14.toValue(6n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
                                     'CredentialRegistry.compact line 54 char 1',
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
                                                                                            value: { value: _descriptor_14.toValue(6n),
                                                                                                     alignment: _descriptor_14.alignment() } }] } },
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
        const self_0 = state.asArray()[6];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  getHolderSecret: (...args) => undefined,
  getIssuerSecret: (...args) => undefined,
  credentialSalt: (...args) => undefined,
  credentialIssuedAt: (...args) => undefined
});
export const pureCircuits = {};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
