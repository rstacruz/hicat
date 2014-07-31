package PERL::MOD;

# JSON-2.0
use 5.005;
use base qw(Exporter);
use overload ();

$PERL::MOD::VERSION = '2.27203';

# these are some comments.
use constant P_ASCII  => 0;
use constant P_LATIN1 => 1;
use constant P_UTF8   => 2;

BEGIN {
    my @variable = qw( aaa bbb ccc );
    if ($] < 5.008) {
        eval qq| require $helper |;
        if ($@) { Module::load $@; }
    }
}
