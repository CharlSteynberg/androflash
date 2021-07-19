

    import "./abec.mjs";


    let udev = new device("android").define
    ({
        memory: {},


        digest: function(args)
        {
            if (isText(args)){ args = [args] };

            let path = (args.p||args.path||args[0]);
            let tool = (args.t||args.tool||args[1]||"MediaTek");

            if (!isPath(path)){ moan("invalid path"); return }; // validation
            if (!isFunc(this.parser[tool])){ moan("unknown parser-tool: "+tool); return};

            let text = ""; try{ text = server.disk.readFile(path,"utf8") } // let's try to see what happens
            catch(err){ moan(err); return }; // fail gracefully .. TODO :: add tips
            text = (text||"").trim(); if (!text){ moan("invalid structure in "+path); return }; // avoidable issues

            dump(`using the ${tool} parser`);
            this.struct = this.parser[tool](text);
            return this;
        },


        parser:
        {
            "MediaTek": function(text)
            {
                let resl = [];
                text = text.expose("#  EMMC Layout Setting")[2].expose("######\n")[2];
                text.expose("- ","\n\n").forEach((blok)=>{ resl.push(parsed(blok)) });
                return resl;
            },
        },


        deploy: function()
        {
            dump(this.struct);
        },

    });


    udev.digest( parsed(params().join("\n")) )
        .deploy();
