class chatEngine{
    constructor(chatId, userEmail){
this.chatBox=(`#${chatId}`);
this.userEmail=userEmail;
this.socket=io.connect("http://localhost:5000",{
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });

        if (this.userEmail){
            this.connectionHandler();
        }
}
connectionHandler(){
    this.socket.on("connect",()=>{
        console.log("Connection started");
    })
}
    }
    