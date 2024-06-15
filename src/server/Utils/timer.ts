export class NewTimer {

    public promise: Promise<unknown>;
    public cancel;
    public cancelled: boolean;

    private duration: number
    private callback: Callback

    private startCountDown() {
        return new Promise((Resolve, Reject) => {
            for (let i = this.duration; i > 0; i--) {
                if (this.cancelled) {
                    Resolve('Cancelled')
                    return;
                }
                this.callback(i)
                task.wait(1)  
            }
            Resolve("Finished")
        })
    } 

    public constructor( Duration: number, Callback: (TimeLeft: number) => void) 
    {
        this.cancelled = false
        this.duration = Duration
        this.callback = Callback

        this.cancel = () => {
            this.cancelled = true
        }

        this.promise = this.startCountDown()
    }

}
