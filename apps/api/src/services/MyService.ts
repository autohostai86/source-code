/** @format */

class MyService {
    data: string;
    constructor() {
        this.data = 'constructor';
    }

    myMethod(fromMethod: any) {
        this.data = fromMethod;

        return true;
    }
}

export default new MyService();
