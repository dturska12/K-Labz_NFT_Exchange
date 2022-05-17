import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import axios from 'axios';
import React, { Component } from 'react';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const ABI = [
    [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_nativeTokenWrapper",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_thirdwebFee",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "timeBuffer",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "bidBufferBps",
              "type": "uint256"
            }
          ],
          "name": "AuctionBuffersUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "listingId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "closer",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "bool",
              "name": "cancelled",
              "type": "bool"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "auctionCreator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "winningBidder",
              "type": "address"
            }
          ],
          "name": "AuctionClosed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "listingId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "assetContract",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "lister",
              "type": "address"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "listingId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "tokenOwner",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "assetContract",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "endTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "quantity",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "currency",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "reservePricePerToken",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "buyoutPricePerToken",
                  "type": "uint256"
                },
                {
                  "internalType": "enum IMarketplace.TokenType",
                  "name": "tokenType",
                  "type": "uint8"
                },
                {
                  "internalType": "enum IMarketplace.ListingType",
                  "name": "listingType",
                  "type": "uint8"
                }
              ],
              "indexed": false,
              "internalType": "struct IMarketplace.Listing",
              "name": "listing",
              "type": "tuple"
            }
          ],
          "name": "ListingAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "listingId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "listingCreator",
              "type": "address"
            }
          ],
          "name": "ListingRemoved",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "listingId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "listingCreator",
              "type": "address"
            }
          ],
          "name": "ListingUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "listingId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "offeror",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "enum IMarketplace.ListingType",
              "name": "listingType",
              "type": "uint8"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "quantityWanted",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "totalOfferAmount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "currency",
              "type": "address"
            }
          ],
          "name": "NewOffer",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "listingId",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "assetContract",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "lister",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "quantityBought",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "totalPricePaid",
              "type": "uint256"
            }
          ],
          "name": "NewSale",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "platformFeeRecipient",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "platformFeeBps",
              "type": "uint256"
            }
          ],
          "name": "PlatformFeeInfoUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "previousAdminRole",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "newAdminRole",
              "type": "bytes32"
            }
          ],
          "name": "RoleAdminChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            }
          ],
          "name": "RoleGranted",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            }
          ],
          "name": "RoleRevoked",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "DEFAULT_ADMIN_ROLE",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "MAX_BPS",
          "outputs": [
            {
              "internalType": "uint64",
              "name": "",
              "type": "uint64"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_listingId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_offeror",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_currency",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_pricePerToken",
              "type": "uint256"
            }
          ],
          "name": "acceptOffer",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "bidBufferBps",
          "outputs": [
            {
              "internalType": "uint64",
              "name": "",
              "type": "uint64"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_listingId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_buyFor",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_quantityToBuy",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_currency",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_totalPrice",
              "type": "uint256"
            }
          ],
          "name": "buy",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_listingId",
              "type": "uint256"
            }
          ],
          "name": "cancelDirectListing",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_listingId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_closeFor",
              "type": "address"
            }
          ],
          "name": "closeAuction",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "contractType",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "pure",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "contractURI",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "contractVersion",
          "outputs": [
            {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "pure",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "assetContract",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "secondsUntilEndTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "quantityToList",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "currencyToAccept",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "reservePricePerToken",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "buyoutPricePerToken",
                  "type": "uint256"
                },
                {
                  "internalType": "enum IMarketplace.ListingType",
                  "name": "listingType",
                  "type": "uint8"
                }
              ],
              "internalType": "struct IMarketplace.ListingParameters",
              "name": "_params",
              "type": "tuple"
            }
          ],
          "name": "createListing",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getPlatformFeeInfo",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint16",
              "name": "",
              "type": "uint16"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            }
          ],
          "name": "getRoleAdmin",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "getRoleMember",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            }
          ],
          "name": "getRoleMemberCount",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "grantRole",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "hasRole",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_defaultAdmin",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "_contractURI",
              "type": "string"
            },
            {
              "internalType": "address[]",
              "name": "_trustedForwarders",
              "type": "address[]"
            },
            {
              "internalType": "address",
              "name": "_platformFeeRecipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_platformFeeBps",
              "type": "uint256"
            }
          ],
          "name": "initialize",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "forwarder",
              "type": "address"
            }
          ],
          "name": "isTrustedForwarder",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "listings",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "listingId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "tokenOwner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "assetContract",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "quantity",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "currency",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "reservePricePerToken",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "buyoutPricePerToken",
              "type": "uint256"
            },
            {
              "internalType": "enum IMarketplace.TokenType",
              "name": "tokenType",
              "type": "uint8"
            },
            {
              "internalType": "enum IMarketplace.ListingType",
              "name": "listingType",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes[]",
              "name": "data",
              "type": "bytes[]"
            }
          ],
          "name": "multicall",
          "outputs": [
            {
              "internalType": "bytes[]",
              "name": "results",
              "type": "bytes[]"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_listingId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_quantityWanted",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_currency",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_pricePerToken",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_expirationTimestamp",
              "type": "uint256"
            }
          ],
          "name": "offer",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "offers",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "listingId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "offeror",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "quantityWanted",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "currency",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "pricePerToken",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "expirationTimestamp",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            },
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "name": "onERC1155BatchReceived",
          "outputs": [
            {
              "internalType": "bytes4",
              "name": "",
              "type": "bytes4"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "name": "onERC1155Received",
          "outputs": [
            {
              "internalType": "bytes4",
              "name": "",
              "type": "bytes4"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "name": "onERC721Received",
          "outputs": [
            {
              "internalType": "bytes4",
              "name": "",
              "type": "bytes4"
            }
          ],
          "stateMutability": "pure",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "renounceRole",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "revokeRole",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_timeBuffer",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_bidBufferBps",
              "type": "uint256"
            }
          ],
          "name": "setAuctionBuffers",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_uri",
              "type": "string"
            }
          ],
          "name": "setContractURI",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_platformFeeRecipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_platformFeeBps",
              "type": "uint256"
            }
          ],
          "name": "setPlatformFeeInfo",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes4",
              "name": "interfaceId",
              "type": "bytes4"
            }
          ],
          "name": "supportsInterface",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "thirdwebFee",
          "outputs": [
            {
              "internalType": "contract ITWFee",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "timeBuffer",
          "outputs": [
            {
              "internalType": "uint64",
              "name": "",
              "type": "uint64"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalListings",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_listingId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_quantityToList",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_reservePricePerToken",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_buyoutPricePerToken",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_currencyToAccept",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_secondsUntilEndTime",
              "type": "uint256"
            }
          ],
          "name": "updateListing",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "winningBid",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "listingId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "offeror",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "quantityWanted",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "currency",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "pricePerToken",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "expirationTimestamp",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        }
      ]
]

var account = null;
var contract = null;
var vaultcontract = null;

// You can switch out this provider with any wallet or provider setup you like.
const provider = ethers.Wallet.createRandom();
const sdk = new ThirdwebSDK(provider);
const contract = sdk.getMarketplace("0x5526fb9e98A64F7C95971a2f0580D8cdF172A95a");
const STAKINGCONTRACT = "0x543e33a5bE356C155737C1797c1F6b656F34e224"
const apikey = "d8c48df3a97ac60ab0cb61c63b9b988e";
const endpoint = "https://ipfs.infura.io:5001"
const nftpng = "https://ipfs.io/ipfs/QmetESUb7wTPr8mBHWFsiSKMw6HTLWUGoL8DrkcaY9TTyh/";

const providerOptions = {
	binancechainwallet: {
		package: true
	  },
	  walletconnect: {
		package: WalletConnectProvider,
		options: {
		  infuraId: "3cf2d8833a2143b795b7796087fff369"
		}
	},
	walletlink: {
		package: WalletLink, 
		options: {
		  appName: "K-Labz NFT Exchange", 
		  infuraId: "29FnXtT3Ls1r6ZiNdNEZmi2rDZu",
		  rpc: "", 
		  chainId: 1, 
		  appLogoUrl: null, 
		  darkMode: true 
		}
	  },
};

const web3Modal = new Web3Modal({
	network: "ethereum",
	theme: "dark",
	cacheProvider: true,
	providerOptions 
  });


async function connectwallet() { 
      var provider = await web3Modal.connect();
      var web3 = new Web3(provider); 
      await provider.send('eth_requestAccounts'); 
      var accounts = await web3.eth.getAccounts(); 
      account = accounts[0]; 
      document.getElementById('wallet-address').textContent = account; 
      contract = new web3.eth.Contract(ABI, NFTCONTRACT);
	  vaultcontract = new web3.eth.Contract(VAULTABI, STAKINGCONTRACT);
}
async function mint() {
        var _mintAmount = Number(document.querySelector("[name=amount]").value); 
        var mintRate = Number(await contract.methods.cost().call()); 
        var totalAmount = mintRate * _mintAmount; 
      contract.methods.mint(account, _mintAmount).send({ from: account, value: String(totalAmount) }); 
    } 

async function stakeit() {
	var tokenids = Number(document.querySelector("[name=stkid]").value);
	vaultcontract.methods.stake([tokenids]).send({from: account});
}

async function unstakeit() {
	var tokenids = Number(document.querySelector("[name=stkid]").value);
	vaultcontract.methods.unstake([tokenids]).send({from: account});
}

class App extends Component {
	constructor() {
		super();
		this.state = {
			balance: [],
			nftdata: [],
		};
	}

	async componentDidMount() {
		
		await axios.get((endpoint + `?module=stats&action=tokensupply&contractaddress=${NFTCONTRACT}&apikey=${apikey}`))
		.then(outputa => {
            this.setState({
                balance:outputa.data
            })
            console.log(outputa.data)
        })

		await axios.get((endpoint + `?module=account&action=tokennfttx&contractaddress=${NFTCONTRACT}&page=1&offset=100&tag=latest&apikey=${apikey}`))
		.then(outputb => {
			const { result } = outputb.data
            this.setState({
                nftdata:result
            })
            console.log(outputb.data)
        })
	}
  
  render() {
	const {balance} = this.state;
	const {nftdata} = this.state;

  return (
    <div className="App">
 <div className='container'>
<div className='row'>
  <form class="gradient col-lg-5 mt-5" style={{borderRadius:"25px",boxShadow:"1px 1px 15px #000000", marginRight:"5px"}}>
    <h4 style={{color:"#FFFFFF"}}>Mint Portal</h4>
    <h5 style={{color:"#FFFFFF"}}>Please connect your wallet</h5>
    <Button onClick={connectwallet} style={{marginBottom:"5px",color:"#FFFFFF"}}>Connect Wallet</Button>
    <div class="card" id='wallet-address' style={{marginTop:"3px",boxShadow:"1px 1px 4px #000000"}}>
      <label for="floatingInput">Wallet Address</label>
      </div>
      <div class="card" style={{marginTop:"3px",boxShadow:"1px 1px 4px #000000"}}>
      <input type="number" name="amount" defaultValue="1" min="1" max="5"/>
      <label >Please select the amount of NFTs to mint.</label>
      <Button onClick={mint}>Buy/Mint!</Button>
      </div>
    <label style={{color:"#FFFFFF"}}>Price 0.05 ETH each mint.</label>
	<h5 style={{color:"white", textShadow:"1px 1px 3px #000000"}}> Tokens Minted so far= {balance.result}/1000</h5>
  </form>
  <form class="gradient col-lg-5 mt-5" style={{borderRadius:"25px",boxShadow:"1px 1px 15px #000000", marginRight:"5px"}}>
    <h4 style={{color:"#FFFFFF"}}>Staking Vault</h4>
    <h5 style={{color:"#FFFFFF"}}>Please connect your wallet</h5>
    <Button onClick={connectwallet} style={{marginBottom:"5px",color:"#FFFFFF"}}>Connect Wallet</Button>
      <div class="card" style={{marginTop:"3px",boxShadow:"1px 1px 4px #000000"}}>
      <input type="number" name="stkid"/>
      <label >Input NFT ID</label>
      <Button onClick={stakeit}>STAKE</Button>
	  <Button onClick={unstakeit}>UNSTAKE</Button>
      </div>
  </form>
  <div className="row items mt-3">
  <div className="ml-3 mr-3" style={{display: "inline-grid",gridTemplateColumns: "repeat(4, 5fr)",columnGap: "10px"}}>
  {nftdata.map(result => {
	  return (
			<div className="card">
            		<div className="image-over">
					<img className="card-img-top" src={nftpng + result.tokenID +'.png'} alt="" />
					</div>
					<div className="card-caption col-12 p-0">
                    	<div className="card-body">
							<h5 className="mb-0">K-Kabz NFT Exchange #{result.tokenID}</h5>
							<h5 className="mb-0 mt-2">Owner Wallet:<p style={{color:"#39FF14",fontWeight:"bold",textShadow:"1px 1px 2px #000000"}}>{result.to}</p></h5>
                    	<div className="card-bottom d-flex justify-content-between">
							<Button className="btn btn-bordered-white btn-smaller mt-3">
								<i className="mr-2" />Buy Now
							</Button>
							</div>
					</div>
                </div>
            </div>
        );
    })}
	</div>
</div>
  </div>
	</div>
 	</div>
  			);
	};
}

export default App;
