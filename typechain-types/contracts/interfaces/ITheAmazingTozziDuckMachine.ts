/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export declare namespace ITheAmazingTozziDuckMachine {
  export type MachineConfigStruct = {
    tozziDuckPrice: PromiseOrValue<BigNumberish>;
    customDuckPrice: PromiseOrValue<BigNumberish>;
    maxCustomDucks: PromiseOrValue<BigNumberish>;
    tozziDuckMintStatus: PromiseOrValue<BigNumberish>;
    customDuckMintStatus: PromiseOrValue<BigNumberish>;
  };

  export type MachineConfigStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    number,
    number
  ] & {
    tozziDuckPrice: BigNumber;
    customDuckPrice: BigNumber;
    maxCustomDucks: BigNumber;
    tozziDuckMintStatus: number;
    customDuckMintStatus: number;
  };
}

export interface ITheAmazingTozziDuckMachineInterface extends utils.Interface {
  functions: {
    "burnRenegadeDuck(uint256,string)": FunctionFragment;
    "mintCustomDuck(address,string)": FunctionFragment;
    "mintTozziDuck(address,uint256,string,bytes32[])": FunctionFragment;
    "ownerMint(address,string)": FunctionFragment;
    "setArtistName(uint256,bytes32)": FunctionFragment;
    "setDuckAllowance(address,uint128,uint128)": FunctionFragment;
    "setDuckProfile(uint256,bytes32,bytes32,string)": FunctionFragment;
    "setDuckTitle(uint256,bytes32)": FunctionFragment;
    "setMOTD(string)": FunctionFragment;
    "setMachineConfig((uint256,uint256,uint256,uint8,uint8))": FunctionFragment;
    "setOwnershipTokenURI(string)": FunctionFragment;
    "withdraw(address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "burnRenegadeDuck"
      | "mintCustomDuck"
      | "mintTozziDuck"
      | "ownerMint"
      | "setArtistName"
      | "setDuckAllowance"
      | "setDuckProfile"
      | "setDuckTitle"
      | "setMOTD"
      | "setMachineConfig"
      | "setOwnershipTokenURI"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "burnRenegadeDuck",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "mintCustomDuck",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "mintTozziDuck",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "ownerMint",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setArtistName",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "setDuckAllowance",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setDuckProfile",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setDuckTitle",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "setMOTD",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setMachineConfig",
    values: [ITheAmazingTozziDuckMachine.MachineConfigStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "setOwnershipTokenURI",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "burnRenegadeDuck",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintCustomDuck",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintTozziDuck",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ownerMint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setArtistName",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDuckAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDuckProfile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDuckTitle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setMOTD", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setMachineConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOwnershipTokenURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "CustomDuckBurned(uint256,address,address,string)": EventFragment;
    "DuckMinted(uint256,address,uint8,uint256)": EventFragment;
    "DuckProfileUpdated(uint256,bytes32,bytes32,string)": EventFragment;
    "DuckTitleGranted(uint256,bytes32,address)": EventFragment;
    "MOTDSet(address,string)": EventFragment;
    "MachineConfigUpdated(address,uint256,uint256,uint256,uint8,uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CustomDuckBurned"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DuckMinted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DuckProfileUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DuckTitleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MOTDSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MachineConfigUpdated"): EventFragment;
}

export interface CustomDuckBurnedEventObject {
  duckId: BigNumber;
  admin: string;
  owner: string;
  reason: string;
}
export type CustomDuckBurnedEvent = TypedEvent<
  [BigNumber, string, string, string],
  CustomDuckBurnedEventObject
>;

export type CustomDuckBurnedEventFilter =
  TypedEventFilter<CustomDuckBurnedEvent>;

export interface DuckMintedEventObject {
  tokenId: BigNumber;
  who: string;
  duckType: number;
  price: BigNumber;
}
export type DuckMintedEvent = TypedEvent<
  [BigNumber, string, number, BigNumber],
  DuckMintedEventObject
>;

export type DuckMintedEventFilter = TypedEventFilter<DuckMintedEvent>;

export interface DuckProfileUpdatedEventObject {
  duckId: BigNumber;
  name: string;
  status: string;
  description: string;
}
export type DuckProfileUpdatedEvent = TypedEvent<
  [BigNumber, string, string, string],
  DuckProfileUpdatedEventObject
>;

export type DuckProfileUpdatedEventFilter =
  TypedEventFilter<DuckProfileUpdatedEvent>;

export interface DuckTitleGrantedEventObject {
  tokenId: BigNumber;
  title: string;
  owner: string;
}
export type DuckTitleGrantedEvent = TypedEvent<
  [BigNumber, string, string],
  DuckTitleGrantedEventObject
>;

export type DuckTitleGrantedEventFilter =
  TypedEventFilter<DuckTitleGrantedEvent>;

export interface MOTDSetEventObject {
  owner: string;
  message: string;
}
export type MOTDSetEvent = TypedEvent<[string, string], MOTDSetEventObject>;

export type MOTDSetEventFilter = TypedEventFilter<MOTDSetEvent>;

export interface MachineConfigUpdatedEventObject {
  who: string;
  tozziDuckPrice: BigNumber;
  customDuckPrice: BigNumber;
  maxCustomDucks: BigNumber;
  tozziDuckMintStatus: number;
  customDuckMintStatus: number;
}
export type MachineConfigUpdatedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, number, number],
  MachineConfigUpdatedEventObject
>;

export type MachineConfigUpdatedEventFilter =
  TypedEventFilter<MachineConfigUpdatedEvent>;

export interface ITheAmazingTozziDuckMachine extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ITheAmazingTozziDuckMachineInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    burnRenegadeDuck(
      tokenId: PromiseOrValue<BigNumberish>,
      reason: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    mintCustomDuck(
      to: PromiseOrValue<string>,
      webp: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    mintTozziDuck(
      to: PromiseOrValue<string>,
      duckId: PromiseOrValue<BigNumberish>,
      webp: PromiseOrValue<string>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    ownerMint(
      to: PromiseOrValue<string>,
      webp: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setArtistName(
      tokenId: PromiseOrValue<BigNumberish>,
      name: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDuckAllowance(
      who: PromiseOrValue<string>,
      tozziDuckAllowance: PromiseOrValue<BigNumberish>,
      customDuckAllowance: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDuckProfile(
      tokenId: PromiseOrValue<BigNumberish>,
      name: PromiseOrValue<BytesLike>,
      status: PromiseOrValue<BytesLike>,
      description: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDuckTitle(
      tokenId: PromiseOrValue<BigNumberish>,
      title: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setMOTD(
      motd: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setMachineConfig(
      _machineConfig: ITheAmazingTozziDuckMachine.MachineConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setOwnershipTokenURI(
      ownershipTokenUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  burnRenegadeDuck(
    tokenId: PromiseOrValue<BigNumberish>,
    reason: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  mintCustomDuck(
    to: PromiseOrValue<string>,
    webp: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  mintTozziDuck(
    to: PromiseOrValue<string>,
    duckId: PromiseOrValue<BigNumberish>,
    webp: PromiseOrValue<string>,
    merkleProof: PromiseOrValue<BytesLike>[],
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  ownerMint(
    to: PromiseOrValue<string>,
    webp: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setArtistName(
    tokenId: PromiseOrValue<BigNumberish>,
    name: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDuckAllowance(
    who: PromiseOrValue<string>,
    tozziDuckAllowance: PromiseOrValue<BigNumberish>,
    customDuckAllowance: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDuckProfile(
    tokenId: PromiseOrValue<BigNumberish>,
    name: PromiseOrValue<BytesLike>,
    status: PromiseOrValue<BytesLike>,
    description: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDuckTitle(
    tokenId: PromiseOrValue<BigNumberish>,
    title: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setMOTD(
    motd: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setMachineConfig(
    _machineConfig: ITheAmazingTozziDuckMachine.MachineConfigStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setOwnershipTokenURI(
    ownershipTokenUri: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    recipient: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    burnRenegadeDuck(
      tokenId: PromiseOrValue<BigNumberish>,
      reason: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    mintCustomDuck(
      to: PromiseOrValue<string>,
      webp: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    mintTozziDuck(
      to: PromiseOrValue<string>,
      duckId: PromiseOrValue<BigNumberish>,
      webp: PromiseOrValue<string>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides
    ): Promise<void>;

    ownerMint(
      to: PromiseOrValue<string>,
      webp: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setArtistName(
      tokenId: PromiseOrValue<BigNumberish>,
      name: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    setDuckAllowance(
      who: PromiseOrValue<string>,
      tozziDuckAllowance: PromiseOrValue<BigNumberish>,
      customDuckAllowance: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setDuckProfile(
      tokenId: PromiseOrValue<BigNumberish>,
      name: PromiseOrValue<BytesLike>,
      status: PromiseOrValue<BytesLike>,
      description: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setDuckTitle(
      tokenId: PromiseOrValue<BigNumberish>,
      title: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    setMOTD(
      motd: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setMachineConfig(
      _machineConfig: ITheAmazingTozziDuckMachine.MachineConfigStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    setOwnershipTokenURI(
      ownershipTokenUri: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdraw(
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "CustomDuckBurned(uint256,address,address,string)"(
      duckId?: null,
      admin?: null,
      owner?: null,
      reason?: null
    ): CustomDuckBurnedEventFilter;
    CustomDuckBurned(
      duckId?: null,
      admin?: null,
      owner?: null,
      reason?: null
    ): CustomDuckBurnedEventFilter;

    "DuckMinted(uint256,address,uint8,uint256)"(
      tokenId?: PromiseOrValue<BigNumberish> | null,
      who?: PromiseOrValue<string> | null,
      duckType?: PromiseOrValue<BigNumberish> | null,
      price?: null
    ): DuckMintedEventFilter;
    DuckMinted(
      tokenId?: PromiseOrValue<BigNumberish> | null,
      who?: PromiseOrValue<string> | null,
      duckType?: PromiseOrValue<BigNumberish> | null,
      price?: null
    ): DuckMintedEventFilter;

    "DuckProfileUpdated(uint256,bytes32,bytes32,string)"(
      duckId?: PromiseOrValue<BigNumberish> | null,
      name?: PromiseOrValue<BytesLike> | null,
      status?: PromiseOrValue<BytesLike> | null,
      description?: null
    ): DuckProfileUpdatedEventFilter;
    DuckProfileUpdated(
      duckId?: PromiseOrValue<BigNumberish> | null,
      name?: PromiseOrValue<BytesLike> | null,
      status?: PromiseOrValue<BytesLike> | null,
      description?: null
    ): DuckProfileUpdatedEventFilter;

    "DuckTitleGranted(uint256,bytes32,address)"(
      tokenId?: PromiseOrValue<BigNumberish> | null,
      title?: PromiseOrValue<BytesLike> | null,
      owner?: PromiseOrValue<string> | null
    ): DuckTitleGrantedEventFilter;
    DuckTitleGranted(
      tokenId?: PromiseOrValue<BigNumberish> | null,
      title?: PromiseOrValue<BytesLike> | null,
      owner?: PromiseOrValue<string> | null
    ): DuckTitleGrantedEventFilter;

    "MOTDSet(address,string)"(
      owner?: PromiseOrValue<string> | null,
      message?: null
    ): MOTDSetEventFilter;
    MOTDSet(
      owner?: PromiseOrValue<string> | null,
      message?: null
    ): MOTDSetEventFilter;

    "MachineConfigUpdated(address,uint256,uint256,uint256,uint8,uint8)"(
      who?: PromiseOrValue<string> | null,
      tozziDuckPrice?: null,
      customDuckPrice?: null,
      maxCustomDucks?: null,
      tozziDuckMintStatus?: null,
      customDuckMintStatus?: null
    ): MachineConfigUpdatedEventFilter;
    MachineConfigUpdated(
      who?: PromiseOrValue<string> | null,
      tozziDuckPrice?: null,
      customDuckPrice?: null,
      maxCustomDucks?: null,
      tozziDuckMintStatus?: null,
      customDuckMintStatus?: null
    ): MachineConfigUpdatedEventFilter;
  };

  estimateGas: {
    burnRenegadeDuck(
      tokenId: PromiseOrValue<BigNumberish>,
      reason: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    mintCustomDuck(
      to: PromiseOrValue<string>,
      webp: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    mintTozziDuck(
      to: PromiseOrValue<string>,
      duckId: PromiseOrValue<BigNumberish>,
      webp: PromiseOrValue<string>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    ownerMint(
      to: PromiseOrValue<string>,
      webp: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setArtistName(
      tokenId: PromiseOrValue<BigNumberish>,
      name: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDuckAllowance(
      who: PromiseOrValue<string>,
      tozziDuckAllowance: PromiseOrValue<BigNumberish>,
      customDuckAllowance: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDuckProfile(
      tokenId: PromiseOrValue<BigNumberish>,
      name: PromiseOrValue<BytesLike>,
      status: PromiseOrValue<BytesLike>,
      description: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDuckTitle(
      tokenId: PromiseOrValue<BigNumberish>,
      title: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setMOTD(
      motd: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setMachineConfig(
      _machineConfig: ITheAmazingTozziDuckMachine.MachineConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setOwnershipTokenURI(
      ownershipTokenUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdraw(
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    burnRenegadeDuck(
      tokenId: PromiseOrValue<BigNumberish>,
      reason: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    mintCustomDuck(
      to: PromiseOrValue<string>,
      webp: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    mintTozziDuck(
      to: PromiseOrValue<string>,
      duckId: PromiseOrValue<BigNumberish>,
      webp: PromiseOrValue<string>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    ownerMint(
      to: PromiseOrValue<string>,
      webp: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setArtistName(
      tokenId: PromiseOrValue<BigNumberish>,
      name: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDuckAllowance(
      who: PromiseOrValue<string>,
      tozziDuckAllowance: PromiseOrValue<BigNumberish>,
      customDuckAllowance: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDuckProfile(
      tokenId: PromiseOrValue<BigNumberish>,
      name: PromiseOrValue<BytesLike>,
      status: PromiseOrValue<BytesLike>,
      description: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDuckTitle(
      tokenId: PromiseOrValue<BigNumberish>,
      title: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setMOTD(
      motd: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setMachineConfig(
      _machineConfig: ITheAmazingTozziDuckMachine.MachineConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setOwnershipTokenURI(
      ownershipTokenUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
