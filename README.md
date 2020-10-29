# Verify Voting Results

This web application allows everyone to validate the results of votes that were executed on Sögur’s voting platform by reading the necessery information from the Ethereum network and calculting the Democonomy based results. 
The application is using Infura in order to read relevant information from the Ethereum network, so in order to use it, you should enter a valid endpoint for Infura’s API (for example https://mainnet.infura.io/v3/PROJECT_ID). 

Since the result of the vote depends on the SGR and SGN balances at the time the vote has started, there is a need to use an archive node in order to validate the results. If your Infura account doesn’t include access to an archive node, you may choose to use the local CSV that holds the balances instead. 

The code of this web application is open-source, ensuring the transparency of the verification process.

 

# License

Copyright (C) 2020 Sogur Monetary Technologies Limited

This program is free software: you can redistribute it and/or modify

it under the terms of the GNU General Public License as published by

the Free Software Foundation, either version 3 of the License, or

(at your option) any later version.

This program is distributed in the hope that it will be useful,

but WITHOUT ANY WARRANTY; without even the implied warranty of

MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License

along with this program. If not, see <https://www.gnu.org/licenses/>.

Contact Information : info@sogur.com

Sogur Monetary Technologies Limited\
201 Haverstock Hill\
c/o Fkgb Accounting Ltd\
London, NW3 4QG\
United Kingdom


# 3rd Parties

Web3.js - https://github.com/ethereum/web3.js/blob/v1.2.11/LICENSE \
PapaParse -  https://github.com/mholt/PapaParse/blob/5.3.0/LICENSE \
JQuery - https://github.com/jquery/jquery/blob/3.2.1/LICENSE.txt