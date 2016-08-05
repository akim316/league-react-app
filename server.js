var express = require('express');
var request = require('request');
var app = express();
var _ = require('lodash');
var async = require('async');

var globalHost = 'https://global.api.pvp.net/api/lol/';
var apiKey = '6f6f085a-ac1a-4500-9b71-0a0b8f707eeb';

function getLatestVersion(region) {

}

app.get('/region/:region/username/:username', function(req, res) {
  var id = '';
  var region = req.params.region.toLowerCase();
  var summonerName = req.params.username;
  var version = getLatestVersion(region);
  request('https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + summonerName + '?api_key=' + apiKey, function(error, response, body) {
    var str = summonerName.replace(/\s+/g, '');
    var obj = JSON.parse(body);
    for (var x in obj) {
      id = obj[x].id;
    }
    request('https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.3/stats/by-summoner/' + id + '/ranked' + '?api_key=' + apiKey, function(error, response, body) {
      var summoner = JSON.parse(body);
      request(globalHost + 'static-data/' + region + '/v1.2/versions?api_key=' + apiKey, function (error, response, body) {
        var versions = JSON.parse(body);
        console.log(summoner.champions);
        async.eachOf(summoner.champions, function(element, key, callback) {
          request(globalHost + 'static-data/na/v1.2/champion/' + element.id + '?champData=image&api_key=' + apiKey, function(error, response, body2) {
            var champInfo = JSON.parse(body2);
            if (element.id != 0) {
              element.champion = champInfo;
              element.imgUrl = 'http://ddragon.leagueoflegends.com/cdn/' + versions[0] + '/img/champion/' + champInfo.image.full;
            }
            callback();
          });
        }, function(err) {
          if (err) {
            console.log(err);
          } else {
            res.json(summoner);
          }
        });
      });

    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
