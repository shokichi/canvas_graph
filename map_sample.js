/*
 * 地図を描画する
 *
 */

function map_sample(){
    var map = L.map('map');
    L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
    {attributtion: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_brank'>国土地理院地図</a>"
    }).addTo(map);
    
    map.setView([35,135],5);
}
