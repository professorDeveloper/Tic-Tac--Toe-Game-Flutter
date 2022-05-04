import 'package:flutter/material.dart';
class GameScreen extends StatefulWidget {
  const GameScreen({Key? key}) : super(key: key);
  static String routeName ='/game';
  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
    body: Center(
      child: Text("Hush kelibsiz"),
    ),
    );
  }
}
