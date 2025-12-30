import { join } from "path";
import maxmind, { Reader, type AsnResponse, type CityResponse, type CountryResponse } from 'maxmind';
import express from 'express'
import countryToCurrency, { type Countries } from "country-to-currency";

export class Maxmind {
    public readonly asn: Reader<AsnResponse>;
    public readonly city: Reader<CityResponse>;
    public readonly country: Reader<CountryResponse>

    private constructor(asn: Reader<AsnResponse>, city: Reader<CityResponse>, country: Reader<CountryResponse>) {
        this.asn = asn;
        this.city = city;
        this.country = country
    }

    public location(request: express.Request) {
        const location = this.city.get(request.ip || '');

        // check if currency is accepted in chargebee, if not, fallback to usd
        if (location?.country != undefined) {
            const country = location.country.iso_code as Countries;
            const currency = countryToCurrency[country];

            return {
                country,
                currency
            }
        }

        return {
            country: 'US' as Countries,
            currency: 'USD' as typeof countryToCurrency['US']
        }
    }

    public static async init() {
        const [asn, city, country] = await Promise.all([
            maxmind.open<AsnResponse>(join(process.cwd(), './geo', 'asn.mmdb'), { watchForUpdates: true }),
            maxmind.open<CityResponse>(join(process.cwd(), './geo', 'city.mmdb'), { watchForUpdates: true }),
            maxmind.open<CountryResponse>(join(process.cwd(), './geo', 'country.mmdb'), { watchForUpdates: true })
        ])

        return new Maxmind(asn, city, country)
    }
}