import 'dart:io';

import 'package:flutter/material.dart';
import 'package:online_tic_tac_toe/resources/socet_cilent.dart';
import 'package:provider/provider.dart';
import "package:socket_io_client/src/socket.dart" show Socket;

import '../screens/game_screen.dart';

class SocketMethods {
  final _socketClient = SocketClient.instance.socket!;

  Socket get socketClient => _socketClient;

  // EMITS
  void createRoom(String nickname) {
    if (nickname.isNotEmpty) {
      _socketClient.emit('createRoom', {
        'nickname': nickname,
      });
    }
  }
  // Listener
  void createRoomSuccessListener(BuildContext context) {
    _socketClient.on('create', (room) {
      print(room);
      Navigator.pushNamed(context, GameScreen.routeName);
    });
  }

}
