module.exports = {
  getPreBattle: function(group_session) {
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "Pilih Attackmu!",
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#FFFFFF"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: []
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
        },
        styles: {
          header: {
            backgroundColor: "#1DB446"
          }
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
    return flex_msg;
  },
  getPostBattle: function(group_session) {
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "Hasil Attack",
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#FFFFFF"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: []
        },
        styles: {
          header: {
            backgroundColor: "#1DB446"
          }
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
        }
      ]
    };
    flex_msg.contents.body.contents.push(table);

    var playerTable = {};

    var num = 1;
    for (let i = 0; i < group_session.players.length; i++) {
      if (group_session.players[i].attack !== "") {
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
        if (group_session.players[i].attacker.length !== 0) {
          let attacker = group_session.players[i].attacker.join(", ");
          playerTable[i].contents[3].text = attacker;
        }
        flex_msg.contents.body.contents.push(playerTable[i]);
        num++;
      }
    }
    return flex_msg;
  },
  getNewGame: function() {
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "Game baru telah dibuat",
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#FFFFFF"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "Ayok joing!",
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
        },
        styles: {
          header: {
            backgroundColor: "#1DB446"
          }
        }
      }
    };
    return flex_msg;
  },
  getFlex: function(flex_text) {
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: flex_text.header,
              weight: 'bold',
              size: 'xl',
              wrap: true,
              color: '#ffffff'
            }
            ]
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: flex_text.body,
              weight: "regular",
              size: "xl",
              margin: "md",
              wrap: true
            }
          ]
        },
        styles : {
          header: {
            backgroundColor: '#1DB446'
          }
        }
      }
    };
    return flex_msg;
  },
  getEndGame: function(group_session, header){
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: header,
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#FFFFFF"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "No"
                },
                {
                  type: "text",
                  text: "Name",
                  flex: 3
                },
                {
                  type: "text",
                  text: "Attack",
                  flex: 2
                },
                {
                  type: "text",
                  text: "Attacker",
                  flex: 4
                }
              ],
              margin: "none",
              spacing: "none"
            },
            {
              type: "separator",
              margin: "none",
              color: "#000000"
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
                label: "Play Egen",
                data: "/new"
              }
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#1DB446"
          }
        }
      }
    };

    var playerTable = {};

    var num = 1;
    for (let i = 0; i < group_session.players.length; i++) {
      if (group_session.players[i].attack !== "") {
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
              wrap: true,
              flex: 3
            },
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true,
              flex: 2
            },
            {
              type: "text",
              text: "gak ada",
              size: "md",
              wrap: true,
              flex: 4
            }
          ]
        };

        playerTable[i].contents[0].text += num;
        playerTable[i].contents[1].text += group_session.players[i].name;
        playerTable[i].contents[2].text += group_session.players[i].attack;
        if (group_session.players[i].attacker.length !== 0) {
          let attacker = group_session.players[i].attacker.join(", ");
          playerTable[i].contents[3].text = attacker;
        }
        flex_msg.contents.body.contents.push(playerTable[i]);
        num++;
      }
    }

    return flex_msg;
  },
  getPlayerList: function(group_session){
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "List Pemain",
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#FFFFFF"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "No"
                },
                {
                  type: "text",
                  text: "Name"
                },
                {
                  type: "text",
                  text: "Status"
                }
              ],
              margin: "none",
              spacing: "none"
            },
            {
              type: "separator",
              margin: "none",
              color: "#000000"
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#1DB446"
          }
        }
      }
    };

    var playerTable = {};

    var num = 1;
    for (let i = 0; i < group_session.players.length; i++) {
     
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
              wrap: true,
            },
            {
              type: 'text',
              text: '',
              size: 'md',
              wrap: true
            }
          ]
        };

        playerTable[i].contents[0].text += num;
        playerTable[i].contents[1].text += group_session.players[i].name;
        playerTable[i].contents[2].text = 'pending';
        if (group_session.players[i].attack !== ''){
          playerTable[i].contents[2].text = 'done';
        }
        flex_msg.contents.body.contents.push(playerTable[i]);
        num++;
    }

    return flex_msg;
  }
};
