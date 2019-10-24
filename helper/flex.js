module.exports = {
  getPreBattle: function(group_session) {
    var flex_msg = {
      type: "flex",
      altText: "📣 Pilih Attack!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "📣 Pilih Attackmu!",
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#F6F6F6"
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
                  color: '#2D4059',
                  action: {
                    type: "postback",
                    label: "👊",
                    data: "/attack batu"
                  }
                },
                {
                  type: "button",
                  style: "primary",
                  color: '#2D4059',
                  action: {
                    type: "postback",
                    label: "✌️",
                    data: "/attack gunting"
                  }
                },
                {
                  type: "button",
                  style: "primary",
                  color: '#2D4059',
                  action: {
                    type: "postback",
                    label: "✋",
                    data: "/attack kertas"
                  }
                }
              ]
            },
            // {
            //   type: "box",
            //   layout: "horizontal",
            //   contents: [
            //     {
            //       type: "button",
            //       style: "primary",
            //       action: {
            //         type: "postback",
            //         label: "kertas",
            //         data: "/attack kertas"
            //       }
            //     }
            //   ]
            // }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#2D4059"
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
          text: "No",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 1
        },
        {
          type: "text",
          text: "Nama",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 3
        },
        {
          type: "text",
          text: "Health",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 3,
          align: "center"
        }
      ]
    };
    
    if (group_session.mode === 'team'){
      table.contents.push({
          type: "text",
          text: "Team",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 2,
          align: "end"
        })
    }

    let separator = {
      type: "separator",
      margin: "xs",
      color: "#2D4059"
    };

    flex_msg.contents.body.contents.push(table, separator);

    var playerTable = {};

    var num = 1;
    for (let i = 0; i < group_session.players.length; i++) {
      if (group_session.players[i].health > 0 && group_session.players[i].attack === '') {
        playerTable[i] = {
          type: "box",
          layout: "horizontal",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "",
              size: "md",
              wrap: true,
              flex: 1
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
              flex: 3,
              align: "center"
            }
          ]
        };
        
        if (group_session.mode === 'team'){
          playerTable[i].contents.push({
            type: "text",
            text: group_session.players[i].team,
            size: "md",
            wrap: true,
            flex: 2,
            align: "end"
          })
        }
        
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
      altText: "📣 Ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "🎌 Hasil Attack",
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#F6F6F6"
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
            backgroundColor: "#2D4059"
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
          text: "Nama",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 3
        },
        {
          type: "text",
          text: "Atk",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 2
        },
        {
          type: "text",
          text: "Attacker",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 3
        }
      ]
    };
    
    if (group_session.mode === 'team'){
      table.contents.push({
          type: "text",
          text: "Team",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 2,
          align: "end"
        })
    }

    let separator = {
      type: "separator",
      margin: "xs",
      color: "#2D4059"
    };

    flex_msg.contents.body.contents.push(table, separator);

    var playerTable = {};

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
              flex: 3
            }
          ]
        };

        if (group_session.mode === 'team'){
          playerTable[i].contents.push({
            type: "text",
            text: group_session.players[i].team,
            size: "md",
            wrap: true,
            flex: 2,
            align: "end"
          })
        }
        
        playerTable[i].contents[0].text += group_session.players[i].name;
        playerTable[i].contents[1].text += group_session.players[i].attack;
        if (group_session.players[i].attacker.length !== 0) {
          let attacker = group_session.players[i].attacker.join(", ");
          playerTable[i].contents[2].text = attacker;
        }
        flex_msg.contents.body.contents.push(playerTable[i]);
      }
    }
    return flex_msg;
  },
  getNewGame: function(group_session) {
    var flex_msg = {
      type: "flex",
      altText: "📣 Game baru telah dibuat!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "🎮 Game baru telah dibuat",
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#F6F6F6"
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
              text: "Mode : " + group_session.mode,
              weight: "regular",
              size: "lg",
              wrap: true
            },
            {
              type: "text",
              text: "Ayok Gabung!",
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
              color: "#2D4059",
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
            backgroundColor: "#2D4059"
          }
        }
      }
    };
    return flex_msg;
  },
  getFlex: function(flex_text) {
    var flex_msg = {
      type: "flex",
      altText: "📣 Ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: flex_text.header,
              weight: "bold",
              size: "lg",
              wrap: true,
             color: "#F6F6F6"
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
              size: "md",
              margin: "md",
              wrap: true
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#2D4059"
          }
        }
      }
    };
    return flex_msg;
  },
  getEndGame: function(group_session, header) {
    var flex_msg = {
      type: "flex",
      altText: "📣 Ada pesan untuk kamu!",
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
             color: "#F6F6F6"
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
                  flex: 3,
                  align: "center"
                }
              ],
              margin: "none",
              spacing: "none"
            },
            {
              type: "separator",
              margin: "none",
              color: "#2D4059"
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
              color: '#2D4059',
              action: {
                type: "postback",
                label: "main lagi",
                data: "/new"
              }
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#2D4059"
          }
        }
      }
    };
    
    if (group_session.mode === 'team'){
      flex_msg.contents.body.contents[0].contents.push({
          type: "text",
          text: "Team",
          weight: "bold",
          size: "md",
          wrap: true,
          flex: 1,
          align: "end"
        })
    }

    var playerTable = {};

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
              flex: 3,
              align: "center"
            }
          ]
        };

        if (group_session.mode === 'team'){
          playerTable[i].contents.push({
            type: "text",
            text: group_session.players[i].team,
            size: "md",
            wrap: true,
            flex: 1,
            align: "end"
          })
        }
        
        playerTable[i].contents[0].text += group_session.players[i].name;
        playerTable[i].contents[1].text += group_session.players[i].attack;
        if (group_session.players[i].attacker.length !== 0) {
          let attacker = group_session.players[i].attacker.join(", ");
          playerTable[i].contents[2].text = attacker;
        }
        flex_msg.contents.body.contents.push(playerTable[i]);
      }
    }
    
    return flex_msg;
  },
  getPlayerList: function(group_session) {
    var flex_msg = {
      type: "flex",
      altText: "📣 Ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "📜 List Pemain",
              weight: "bold",
              size: "xl",
              wrap: true,
              color: "#F6F6F6"
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
                  text: "Name"
                },
                {
                  type: "text",
                  text: "Status"
                },
              ],
              margin: "none",
              spacing: "none"
            },
            {
              type: "separator",
              margin: "none",
              color: "#2D4059"
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: "#2D4059"
          }
        }
      }
    };
    
    if (group_session.state !== 'new' && group_session.mode === 'team'){
      flex_msg.contents.body.contents[0].contents.push({
                  type: "text",
                  text: "Team"
                })
    }
    
    if (group_session.state === 'new'){
      flex_msg.contents.body.contents[0].contents[1].text = 'Kill';
    }

    var playerTable = {};

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
            wrap: true
          }
        ]
      };
      
      if (group_session.state !== 'new' && group_session.mode === 'team'){
        playerTable[i].contents.push({
            type: "text",
            text: group_session.players[i].team,
            size: "md",
          })
      }

      if (group_session.state === 'new'){
        playerTable[i].contents[1].text += group_session.players[i].killAmount;
      } else {
        if (group_session.players[i].health > 0) {
          playerTable[i].contents[1].text = "survive";
        } else {
          playerTable[i].contents[1].text = "eliminated";
        }
      }

      playerTable[i].contents[0].text += group_session.players[i].name;
      
      flex_msg.contents.body.contents.push(playerTable[i]);
    }

    if (group_session.state === "new") {
      flex_msg.contents.footer = {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: '#2D4059',
            action: {
              type: "postback",
              label: "gabung",
              data: "/join"
            }
          }
        ]
      };
    }

    return flex_msg;
  }
};
