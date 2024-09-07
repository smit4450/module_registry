export abstract class Url {
    private url_string:string;
    private bus_factor: number;
    public constructor(url_string:string, bus_factor:number) {
        this.url_string=url_string;
        this.bus_factor = bus_factor;
    }
    setUrl(url_string:string ){
        this.url_string = url_string;
    }
    set_bus_factor(url_string:string ){
        this.url_string = url_string;
    }
    
    abstract getEndpoint(): void;
}

export class npmUrl extends Url {
    getEndpoint() {
        
    }

    
}

export class gitUrl {
    getEndpoint() {

    }
}