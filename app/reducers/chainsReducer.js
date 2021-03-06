import {
  PAYMENT_CHAIN_SYNC,
  BLOCK_INDEX_PAYMENT_PERCENTAGE,
  BLOCK_INDEX_PAYMENT,
  STAKING,
  WALLET_INFO,
  CHAIN_INFO,
  TRANSACTIONS_DATA,
  SET_DAEMON_VERSION,
  SET_TEMPORARY_BALANCE,
  WALLET_INFO_SEC, TRANSACTIONS_TYPE
} from '../actions/types';


const INITIAL_STATE = {paymentChainSync: 0, loadingBlockIndexPayment: false, blockPayment: 0, headersPayment:0, connectionsPayment: 0, isStaking: false, stakingConfig: false, staking: 0, balance: 0, transactionsData: [], connections: 0, transactionsType: "all", messagingChain: false, fileStorageChain:false, unconfirmedBalance: 0, daemonVersion: '', newMint: 0, immatureBalance: 0 };

export default(state = INITIAL_STATE, action) => {
   if(action.type == BLOCK_INDEX_PAYMENT){
		return {...state, loadingBlockIndexPayment: action.payload}
	}
	else if(action.type == PAYMENT_CHAIN_SYNC){
		let x = action.payload;
		if(action.payload > 100)
			x = 100;
		return {...state, paymentChainSync: x}
	}
	else if(action.type == STAKING){
		return {...state, isStaking: action.payload, password: ""}
	}
	else if(action.type == CHAIN_INFO){
		return {...state, stakingConfig: action.payload.staking, isStaking: (action.payload.staking === true && action.payload.unlocked_until > 0), connections: action.payload.connections, blockPayment: action.payload.blocks, headersPayment: action.payload.headers, connectionsPayment: action.payload.connections}
	}
	else if(action.type == WALLET_INFO){
		return {...state, balance: action.payload.balance, newMint: action.payload.newmint, staking: action.payload.stake}
	}
	else if(action.type == WALLET_INFO_SEC){
		return {...state, unconfirmedBalance: action.payload.unconfirmed_balance, immatureBalance: action.payload.immature_balance}
	}
	else if(action.type == TRANSACTIONS_DATA){
		var data = action.payload.data;
		return {...state, transactionsData: action.payload.data, transactionsType: action.payload.type}
	}
	else if(action.type == TRANSACTIONS_TYPE){
     return {...state, transactionsType: action.payload}
   }
	else if(action.type == SET_DAEMON_VERSION){
	  return {...state, daemonVersion: action.payload}
   	}
   	else if(action.type == SET_TEMPORARY_BALANCE){
   		return {...state, balance: action.payload}
   	}
	return state;
}
