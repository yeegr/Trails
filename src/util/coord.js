"use strict";

/*
var exports;
if (typeof module === "object" && exports) {
	exports = module.exports;
} else if (typeof window !== "undefined") {
	exports = window["eviltransform"] = {};
}
*/

var earthR = 6378137.0;

function outOfChina(lat, lng) {
	if ((lng < 72.004) || (lng > 137.8347)) {
		return true;
	}
	if ((lat < 0.8293) || (lat > 55.8271)) {
		return true;
	}
	return false;
}

function transform(x, y) {
	var xy = x * y;
	var absX = Math.sqrt(Math.abs(x));
	var xPi = x * Math.PI;
	var yPi = y * Math.PI;
	var d = 20.0*Math.sin(6.0*xPi) + 20.0*Math.sin(2.0*xPi);

	var lat = d;
	var lng = d;

	lat += 20.0*Math.sin(yPi) + 40.0*Math.sin(yPi/3.0);
	lng += 20.0*Math.sin(xPi) + 40.0*Math.sin(xPi/3.0);

	lat += 160.0*Math.sin(yPi/12.0) + 320*Math.sin(yPi/30.0);
	lng += 150.0*Math.sin(xPi/12.0) + 300.0*Math.sin(xPi/30.0);

	lat *= 2.0 / 3.0;
	lng *= 2.0 / 3.0;

	lat += -100.0 + 2.0*x + 3.0*y + 0.2*y*y + 0.1*xy + 0.2*absX;
	lng += 300.0 + x + 2.0*y + 0.1*x*x + 0.1*xy + 0.1*absX;

	return {lat: lat, lng: lng}
}

function delta(lat, lng) {
	var ee = 0.00669342162296594323;
	var d = transform(lng-105.0, lat-35.0);
	var radLat = lat / 180.0 * Math.PI;
	var magic = Math.sin(radLat);
	magic = 1 - ee*magic*magic;
	var sqrtMagic = Math.sqrt(magic);
	d.lat = (d.lat * 180.0) / ((earthR * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
	d.lng = (d.lng * 180.0) / (earthR / sqrtMagic * Math.cos(radLat) * Math.PI);
	return d;
}

export function wgs2gcj(wgsLat, wgsLng) {
	if (outOfChina(wgsLat, wgsLng)) {
		return {lat: wgsLat, lng: wgsLng};
	}
	var d = delta(wgsLat, wgsLng);
	return {lat: wgsLat + d.lat, lng: wgsLng + d.lng};
}
//exports.wgs2gcj = wgs2gcj;

export function gcj2wgs(gcjLat, gcjLng) {
	if (outOfChina(gcjLat, gcjLng)) {
		return {lat: gcjLat, lng: gcjLng};
	}
	var d = delta(gcjLat, gcjLng);
	return {lat: gcjLat - d.lat, lng: gcjLng - d.lng};
}
//exports.gcj2wgs = gcj2wgs;

export function gcj2wgs_exact(gcjLat, gcjLng) {
	var initDelta = 0.01;
	var threshold = 0.000001;
	var dLat = initDelta, dLng = initDelta;
	var mLat = gcjLat-dLat, mLng = gcjLng-dLng;
	var pLat = gcjLat+dLat, pLng = gcjLng+dLng;
	var wgsLat, wgsLng;
	for (var i = 0; i < 30; i++) {
		wgsLat = (mLat+pLat)/2;
		wgsLng = (mLng+pLng)/2;
		var tmp = wgs2gcj(wgsLat, wgsLng)
		dLat = tmp.lat-gcjLat;
		dLng = tmp.lng-gcjLng;
		if ((Math.abs(dLat) < threshold) && (Math.abs(dLng) < threshold)) {
			return {lat: wgsLat, lng: wgsLng};
		}
		if (dLat > 0) {
			pLat = wgsLat;
		} else {
			mLat = wgsLat;
		}
		if (dLng > 0) {
			pLng = wgsLng;
		} else {
			mLng = wgsLng;
		}
	}
	return {lat: wgsLat, lng: wgsLng};
}
//exports.gcj2wgs_exact = gcj2wgs_exact;

export function distance(latA, lngA, latB, lngB) {
	var pi180 = Math.PI / 180;
	var arcLatA = latA * pi180;
 	var arcLatB = latB * pi180;
	var x = Math.cos(arcLatA) * Math.cos(arcLatB) * Math.cos((lngA-lngB)*pi180);
	var y = Math.sin(arcLatA) * Math.sin(arcLatB);
	var s = x + y;
	if (s > 1) {
		s = 1;
	}
	if (s < -1) {
		s = -1;
	}
	var alpha = Math.acos(s);
	var distance = alpha * earthR;
	return distance;
}
//exports.distance = distance;

export function gcj2bd(gcjLat, gcjLng) {
	if (outOfChina(gcjLat, gcjLng)) {
		return {lat: gcjLat, lng: gcjLng};
	}

	var x = gcjLng, y = gcjLat;
	var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
	var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI);
	var bdLng = z * Math.cos(theta) + 0.0065;
	var bdLat = z * Math.sin(theta) + 0.006;
	return {lat: bdLat, lng: bdLng};
}
//exports.gcj2bd = gcj2bd;

export function bd2gcj(bdLat, bdLng) {
	if (outOfChina(bdLat, bdLng)) {
		return {lat: bdLat, lng: bdLng};
	}

	var x = bdLng - 0.0065, y = bdLat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI);
	var gcjLng = z * Math.cos(theta);
	var gcjLat = z * Math.sin(theta);
	return {lat: gcjLat, lng: gcjLng};
}
//exports.bd2gcj = bd2gcj;

export function wgs2bd(wgsLat, wgsLng) {
	var gcj = wgs2gcj(wgsLat, wgsLng);
	return gcj2bd(gcj.lat, gcj.lng);
}
//exports.wgs2bd = wgs2bd;

export function bd2wgs(bdLat, bdLng) {
	var gcj = bd2gcj(bdLat, bdLng);
	return gcj2wgs(gcj.lat, gcj.lng);
}
//exports.bd2wgs = bd2wgs;