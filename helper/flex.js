module.exports = {
  getPreBattle: function(group_session){
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "Pilih Attackmu!",
              weight: "bold",
              size: "xl",
              wrap: true
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              spacing: "md",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  action: {
                    type: "postback",
                    label: "batu",
                    data: "/attack batu"
                  }
                },
                {
                  type: "button",
                  style: "primary",
                  action: {
                    type: "postback",
                    label: "gunting",
                    data: "/attack gunting"
                  }
                }
              ]
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  action: {
                    type: "postback",
                    label: "kertas",
                    data: "/attack kertas"
                  }
                }
              ]
            }
          ]
        }
      }
    };

    var table = {
      type: "box",
      layout: "horizontal",
      spacing: "md",
      contents: [
        {
          type: "text",
          text: "No.",
          weight: "bold",
          size: "md",
          wrap: true
        },
        {
          type: "text",
          text: "Nama",
          weight: "bold",
          size: "md",
          wrap: true
        },
        {
          type: "text",
          text: "Health",
          weight: "bold",
          size: "md",
          wrap: true
        }
      ]
    };
    flex_msg.contents.body.contents.push(table);

    var playerTable = {};

    var num = 1;
    for (let i = 0; i < group_session.players.length; i++) {
      if (group_session.players[i].health > 0) {
        playerTable[i] = {
          type: "box",
          layout: "horizontal",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true
            },
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true
            },
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true
            }
          ]
        };

        playerTable[i].contents[0].text += num;
        playerTable[i].contents[1].text += group_session.players[i].name;
        playerTable[i].contents[2].text += group_session.players[i].health;
        flex_msg.contents.body.contents.push(playerTable[i]);
        num++;
      }
    }
    return flex_msg
  },
  getPostBattle: function(group_session){
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "Hasil Attack",
              weight: "bold",
              size: "xl",
              wrap: true
            }
          ]
        }
      }
    };

    var table = {
      type: "box",
      layout: "horizontal",
      spacing: "md",
      contents: [
        {
          type: "text",
          text: "No.",
          weight: "bold",
          size: "md",
          wrap: true
        },
        {
          type: "text",
          text: "Nama",
          weight: "bold",
          size: "md",
          wrap: true
        },
        {
          type: "text",
          text: "Attack",
          weight: "bold",
          size: "md",
          wrap: true
        },
        {
          type: "text",
          text: "Attacker",
          weight: "bold",
          size: "md",
          wrap: true
        },
      ]
    };
    flex_msg.contents.body.contents.push(table);

    var playerTable = {};

    var num = 1;
    for (let i = 0; i < group_session.players.length; i++) {
      if (group_session.players[i].attack !== ""){
        playerTable[i] = {
        type: "box",
        layout: "horizontal",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "",
            size: "md",
            wrap: true
          },
          {
            type: "text",
            text: "",
            size: "md",
            wrap: true
          },
          {
            type: "text",
            text: "",
            size: "md",
            wrap: true
          },
          {
            type: "text",
            text: "gak ada",
            size: "md",
            wrap: true
          }
        ]
      };

      playerTable[i].contents[0].text += num;
      playerTable[i].contents[1].text += group_session.players[i].name;
      playerTable[i].contents[2].text += group_session.players[i].attack;
      playerTable[i].contents[3].text = group_session.players[i].attacker.join(", ");
      flex_msg.contents.body.contents.push(playerTable[i]);
      num++;
      }
    }

    // return client.replyMessage(event.replyToken, flex_msg).catch(err => {
    //   console.log(err.originalError.config.data);
    // });
    return flex_msg;
  },
  getNewGame: function(){
     var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "Game baru telah dibuat!",
              weight: "bold",
              size: "xl",
              wrap: true
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "primary",
              action: {
                type: "postback",
                label: "gabung",
                data: "/join"
              }
            }
          ]
        }
      }
    };
    // return client.replyMessage(event.replyToken, flex_msg).catch(err => {
    //   console.log(err.originalError.config.data);
    // });
    return flex_msg;
  }
}