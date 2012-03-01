/*
 * Copyright 2011 eBay Software Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var util = require('util'),
    _    = require('underscore');

var cooked ={
    createtable: {
        ports: [
            {
                port: 3000,
                status: 200,
                type: "application",
                subType: "soap+xml",
                payload:
                    '<?xml version="1.0"?>' +
                    '<findItemsByKeywordsResponse xmlns="http://www.ebay.com/marketplace/search/v1/services">' +
                    '<item> <itemId>280770598060</itemId>'+
                    '<title>Apple iPhone 4S (Latest Model) - 16GB - White (AT&amp;T) Smartphone- New In Box</title></item>' +
                    '<item> <itemId>200673744437</itemId>'+
                    '<title>Apple iPhone 4S (Latest Model) 64GB White, GSM Factory Unlocked</title></item>'+
                    '</findItemsByKeywordsResponse>'
            }
        ],
        script: 'create table items on select get from "http://localhost:3000/" '+
                'resultset "findItemsByKeywordsResponse";'+
                'FindItemsByKeywordsResponse = select * from items;'+
                'return "{FindItemsByKeywordsResponse.$..item}";',

        udf: {
            test : function (test, err, result) {
                if(err) {
                    console.log(err.stack || util.inspect(err, false, 10));
                    test.fail('got error');

                }
                else {
                    test.equals(result.headers['content-type'], 'application/json', 'HTML expected');
                    test.ok(_.isArray(result.body), 'expected an array');
                    test.ok(result.body.length > 0, 'expected some items');
                    test.ok(!_.isArray(result.body[0]), 'expected object in the array');

                }
            }
       }
    }
}

module.exports = require('../node_modules/ql-unit/lib/unit').init({
    cooked: cooked
});