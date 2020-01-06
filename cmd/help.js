const flex = require("/app/helper/flex");
function handle(client, event, args, user_session, group_session) {
  let flex_text = {
    header: "",
    body: ""
  };

  flex_text.header = "🧭 Help";

  let helps = [
    "Batu menang vs Gunting",
    "Gunting menang vs Kertas",
    "Kertas menang vs Batu",
    "Untuk daftar perintah bisa ketik /cmd",
    "Energy bertambah setiap round. Jika kamu di hit pemain lain, kamu juga dapat tambahan energy",
    "Buff dapat di peroleh menggunakan energy",
    "Waktu proses game adalah 30 detik",
    "Gunakan perintah '/check' untuk lanjutkan proses jika ada yang afk"
  ];

  let num = 1;
  helps.forEach((item, index) => {
    flex_text.body += num + ". " + item;

    if (index !== helps.length - 1) {
      flex_text.body += "\n";
      num++;
    }
  });

  let flexMsg = flex.getFlex(flex_text);
  client.replyMessage(event.replyToken, flexMsg);
}

module.exports = handle;
