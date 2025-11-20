import { join } from "path";
import maxmind, { Reader, type AsnResponse, type CityResponse, type CountryResponse } from 'maxmind';

export class Maxmind {
    public readonly asn: Reader<AsnResponse>;
    public readonly city: Reader<CityResponse>;
    public readonly country: Reader<CountryResponse>

    private constructor(asn: Reader<AsnResponse>, city: Reader<CityResponse>, country: Reader<CountryResponse>) {
        this.asn = asn;
        this.city = city;
        this.country = country
    }

    public static async open() {
        const [asn, city, country] = await Promise.all([
            maxmind.open<AsnResponse>(join(process.cwd(), './geo', 'asn.mmdb'), { watchForUpdates: true }),
            maxmind.open<CityResponse>(join(process.cwd(), './geo', 'city.mmdb'), { watchForUpdates: true }),
            maxmind.open<CountryResponse>(join(process.cwd(), './geo', 'country.mmdb'), { watchForUpdates: true })
        ])

        return new Maxmind(asn, city, country)
    }
}