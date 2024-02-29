#!/bin/sh
# Name: shellfox.sh
# Desc: Shellfox’es native component: Executes lines of shell recieved on stdin.
# Date: 2024-02-27
# Author: Jaidyn Ann <jadedctrl@posteo.at>
# Dependencies: bc, xxd
# License: GNU GPLv3


# Convert a number in hexadecimal format to decimal.
hex_to_dec() {
	local hex="$1"
	echo "ibase=16; $hex" \
		| bc
}


# Read a native-messaging message from stdin, print it to stdout.
read_message() {
	# Read the length from the four-byte number that leads each message…
	local length_hex="$(head --bytes=4 | xxd -e -u | awk '{print $2}')"
	local length="$(hex_to_dec "$length_hex")"
	# … now read that many bytes.
	head --bytes="$length"
}


# Deescape a JSON stream from input.
json_deescape() {
	sed 's/^"//' \
		| sed 's/"$//' \
		| sed 's/\"/"/g'
}


while true; do
	command="$(read_message | json_deescape)"
	nohup "$SHELL" -c "$command" > /dev/null &
done
